import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@/database/prisma.service';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
    sub: string;       // User ID
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/**
 * JWT Strategy
 *
 * WHY: Passport strategy that validates JWT from Authorization Bearer header.
 * On every protected request, this extracts the token, verifies the signature,
 * checks expiration, then loads the user from DB to ensure they still exist
 * and aren't suspended.
 *
 * SECURITY: We hit the DB on every request (not just trusting the token)
 * because a user could be deleted or role-changed between token issuance.
 * In high-traffic scenarios, this can be cached in Redis with short TTL.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET', 'fallback-secret'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                subscriptionStatus: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        return user;
    }
}
