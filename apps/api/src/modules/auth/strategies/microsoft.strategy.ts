import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

// passport-microsoft uses a different import style
const MicrosoftStrategy = require('passport-microsoft').Strategy;

/**
 * Microsoft OAuth2 Strategy
 *
 * WHY: Enterprise customers often require Microsoft/Azure AD login.
 * Uses the same authorization code flow as Google.
 *
 * MICROSOFT-SPECIFIC:
 * - Uses Microsoft Graph API for profile data
 * - scope 'user.read' grants access to basic profile + email
 * - Works with both personal Microsoft accounts and Azure AD
 */
@Injectable()
export class MsStrategy extends PassportStrategy(MicrosoftStrategy, 'microsoft') {
    private readonly logger = new Logger(MsStrategy.name);

    constructor(
        configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('MICROSOFT_CLIENT_ID', 'not-configured-client-id'),
            clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET', 'not-configured-client-secret'),
            callbackURL: configService.get<string>(
                'MICROSOFT_CALLBACK_URL',
                'http://localhost:3001/api/v1/auth/microsoft/callback',
            ),
            scope: ['user.read'],
            tenant: 'common', // Supports both personal + org accounts
            authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
            tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: Error | null, user?: any) => void,
    ): Promise<void> {
        try {
            const email =
                profile.emails?.[0]?.value ||
                profile._json?.mail ||
                profile._json?.userPrincipalName;

            if (!email) {
                return done(new Error('No email found in Microsoft profile'));
            }

            const user = await this.authService.handleOAuthUser({
                provider: 'MICROSOFT',
                providerId: profile.id,
                email,
                name: profile.displayName || email.split('@')[0],
                avatarUrl: undefined, // Microsoft Graph requires separate call for photo
            });

            done(null, user);
        } catch (error) {
            this.logger.error(`Microsoft OAuth validation failed: ${error}`);
            done(error as Error);
        }
    }
}
