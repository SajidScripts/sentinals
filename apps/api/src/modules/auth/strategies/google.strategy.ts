import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * Google OAuth2 Strategy
 *
 * WHY: Enables "Sign in with Google" — the most common social auth provider.
 * Uses authorization code flow (most secure for server-side apps).
 *
 * FLOW:
 * 1. Frontend redirects to /api/v1/auth/google
 * 2. User authenticates with Google
 * 3. Google redirects to /api/v1/auth/google/callback
 * 4. Strategy extracts profile, calls AuthService.handleOAuthUser()
 * 5. Controller generates tokens and redirects frontend with tokens
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(
        configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
            callbackURL: configService.get<string>(
                'GOOGLE_CALLBACK_URL',
                'http://localhost:3001/api/v1/auth/google/callback',
            ),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        try {
            const { id, displayName, emails, photos } = profile;

            const email = emails?.[0]?.value;
            if (!email) {
                return done(new Error('No email found in Google profile'), undefined);
            }

            const user = await this.authService.handleOAuthUser({
                provider: 'GOOGLE',
                providerId: id,
                email,
                name: displayName || email.split('@')[0],
                avatarUrl: photos?.[0]?.value,
            });

            done(null, user);
        } catch (error) {
            this.logger.error(`Google OAuth validation failed: ${error}`);
            done(error as Error, undefined);
        }
    }
}
