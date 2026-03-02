import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/database/prisma.service';
import { RedisService } from '@/database/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * Auth Service
 *
 * WHY: Handles registration, login, token generation, and refresh.
 *
 * SECURITY DECISIONS:
 * - bcrypt with cost factor 12: balances security and performance (~250ms per hash)
 * - JWT access tokens: 15min TTL. Short-lived to minimize exposure window.
 * - Refresh tokens: 7d TTL, stored in DB. Enables revocation and rotation.
 * - Token family tracking: detects refresh token replay attacks.
 *
 * SCALING CONSIDERATIONS:
 * - Auth is stateless (JWT). Scales horizontally without session affinity.
 * - Refresh tokens in DB allows "logout all devices" functionality.
 * - Redis cache for user lookups reduces DB load under high traffic.
 */
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly BCRYPT_ROUNDS = 12;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private redisService: RedisService,
    ) { }

    /**
     * Register a new user
     */
    async register(dto: RegisterDto) {
        // Check for existing user
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (existing) {
            throw new ConflictException('Email already registered');
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(dto.password, this.BCRYPT_ROUNDS);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                subscriptionStatus: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        this.logger.log(`New user registered: ${user.email}`);

        return {
            user,
            ...tokens,
        };
    }

    /**
     * Login with email and password
     */
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (!user) {
            // WHY: Same error message for wrong email vs wrong password
            // prevents user enumeration attacks
            throw new UnauthorizedException('Invalid email or password');
        }

        // Handle OAuth-only users attempting password login
        if (!user.password) {
            throw new UnauthorizedException(
                `This account uses ${user.authProvider} sign-in. Please use the "${user.authProvider}" button to log in.`,
            );
        }

        const validPassword = await bcrypt.compare(dto.password, user.password);

        if (!validPassword) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);

        this.logger.log(`User logged in: ${user.email}`);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionStatus: user.subscriptionStatus,
            },
            ...tokens,
        };
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshTokens(refreshToken: string) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (storedToken.revoked) {
            // WHY: If a revoked token is used, it means the token was stolen.
            // Revoke ALL tokens in this family to force re-authentication.
            await this.prisma.refreshToken.updateMany({
                where: { family: storedToken.family },
                data: { revoked: true },
            });
            this.logger.warn(`Refresh token replay detected for user: ${storedToken.userId}`);
            throw new UnauthorizedException('Token reuse detected. Please login again.');
        }

        if (new Date() > storedToken.expiresAt) {
            throw new UnauthorizedException('Refresh token expired');
        }

        // Revoke current token (rotation)
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });

        // Generate new token pair with same family
        const tokens = await this.generateTokens(
            storedToken.userId,
            storedToken.user.email,
            storedToken.user.role,
            storedToken.family,
        );

        return {
            user: {
                id: storedToken.user.id,
                name: storedToken.user.name,
                email: storedToken.user.email,
                role: storedToken.user.role,
            },
            ...tokens,
        };
    }

    /**
     * Handle OAuth user (Google / Microsoft)
     *
     * WHY: OAuth users may or may not already have an account.
     * Three cases:
     * 1. New user → create account (no password, authProvider set)
     * 2. Existing user with SAME provider → login
     * 3. Existing user with DIFFERENT provider → link the account
     *    (e.g., user signed up with email, now logs in with Google for same email)
     */
    async handleOAuthUser(profile: {
        provider: 'GOOGLE' | 'MICROSOFT';
        providerId: string;
        email: string;
        name: string;
        avatarUrl?: string;
    }) {
        const { provider, providerId, email, name, avatarUrl } = profile;

        // Check if user already exists by email
        let user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (user) {
            // Link OAuth provider if not already linked
            if (!user.authProviderId || user.authProvider === 'LOCAL') {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        authProvider: provider,
                        authProviderId: providerId,
                        avatarUrl: avatarUrl || user.avatarUrl,
                    },
                });
            }
            this.logger.log(`OAuth login: ${email} via ${provider}`);
        } else {
            // Create new user (no password)
            user = await this.prisma.user.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    password: null,
                    authProvider: provider,
                    authProviderId: providerId,
                    avatarUrl,
                },
            });
            this.logger.log(`OAuth registration: ${email} via ${provider}`);
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.role);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionStatus: user.subscriptionStatus,
            },
            ...tokens,
        };
    }

    /**
     * Logout — revoke all refresh tokens for user
     */
    async logout(userId: string) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: { revoked: true },
        });

        // Clear user cache
        await this.redisService.del(`user:${userId}`);

        this.logger.log(`User logged out: ${userId}`);
    }

    /**
     * Generate access + refresh token pair
     */
    private async generateTokens(
        userId: string,
        email: string,
        role: string,
        family?: string,
    ) {
        const payload: JwtPayload = { sub: userId, email, role };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
        });

        // Create refresh token
        const tokenFamily = family || randomUUID();
        const refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(refreshTokenExpiry) || 7);

        const refreshTokenRecord = await this.prisma.refreshToken.create({
            data: {
                token: randomUUID(),
                userId,
                family: tokenFamily,
                expiresAt,
            },
        });

        return {
            accessToken,
            refreshToken: refreshTokenRecord.token,
            expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
        };
    }
}
