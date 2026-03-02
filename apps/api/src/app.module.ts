import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './database/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { LogModule } from './modules/log/log.module';
import { AdminModule } from './modules/admin/admin.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { HealthModule } from './modules/health/health.module';

@Module({
    imports: [
        // ─── Configuration ─────────────────────────
        // WHY: Centralized env parsing. isGlobal avoids re-importing everywhere.
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '../../.env'],
        }),

        // ─── Structured Logging (Pino) ─────────────
        // WHY: 5-10x faster than Winston. JSON-structured for log aggregation.
        LoggerModule.forRoot({
            pinoHttp: {
                transport:
                    process.env.NODE_ENV !== 'production'
                        ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
                        : undefined,
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                autoLogging: true,
                redact: ['req.headers.authorization'], // Never log JWT tokens
            },
        }),

        // ─── Rate Limiting ─────────────────────────
        // WHY: Prevents brute-force attacks and API abuse.
        // 100 requests per 60-second window per IP.
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 100,
            },
        ]),

        // ─── Database ──────────────────────────────
        PrismaModule,
        RedisModule,

        // ─── Feature Modules ───────────────────────
        AuthModule,
        UserModule,
        ProjectModule,
        LogModule,
        AdminModule,
        SubscriptionModule,
        HealthModule,
    ],
    providers: [
        // Apply rate limiting globally
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
