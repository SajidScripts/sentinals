import {
    Controller,
    Post,
    Get,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { MicrosoftAuthGuard } from './guards/microsoft-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) { }

    @Post('register')
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { ttl: 60000, limit: 10 } })
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout — revoke all refresh tokens' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    async logout(@CurrentUser('id') userId: string) {
        await this.authService.logout(userId);
        return { message: 'Logged out successfully' };
    }

    // ──────────────────────────────────────────────
    // Google OAuth
    // ──────────────────────────────────────────────

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @SkipThrottle()
    @ApiOperation({ summary: 'Initiate Google OAuth login' })
    async googleAuth() {
        // Guard redirects to Google — this body never executes
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @SkipThrottle()
    @ApiExcludeEndpoint()
    async googleCallback(@Req() req: any, @Res() res: Response) {
        return this.handleOAuthCallback(req, res);
    }

    // ──────────────────────────────────────────────
    // Microsoft OAuth
    // ──────────────────────────────────────────────

    @Get('microsoft')
    @UseGuards(MicrosoftAuthGuard)
    @SkipThrottle()
    @ApiOperation({ summary: 'Initiate Microsoft OAuth login' })
    async microsoftAuth() {
        // Guard redirects to Microsoft — this body never executes
    }

    @Get('microsoft/callback')
    @UseGuards(MicrosoftAuthGuard)
    @SkipThrottle()
    @ApiExcludeEndpoint()
    async microsoftCallback(@Req() req: any, @Res() res: Response) {
        return this.handleOAuthCallback(req, res);
    }

    // ──────────────────────────────────────────────
    // Shared OAuth callback handler
    // ──────────────────────────────────────────────

    /**
     * WHY: After the OAuth provider redirect, we can't return JSON because
     * the browser is navigating (not an AJAX call). Instead, we redirect
     * to the frontend with tokens as URL search params.
     *
     * SECURITY: Tokens in URL params are acceptable here because:
     * 1. This is a one-time redirect (params consumed immediately)
     * 2. Frontend strips tokens from URL after reading them
     * 3. HTTPS ensures params aren't visible in transit
     */
    private handleOAuthCallback(req: any, res: Response) {
        const result = req.user;
        const frontendUrl = this.configService.get<string>(
            'FRONTEND_URL',
            'http://localhost:3000',
        );

        const params = new URLSearchParams({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: JSON.stringify(result.user),
        });

        return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    }
}
