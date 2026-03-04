import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    // ─── Pino Logger ─────────────────────────────
    app.useLogger(app.get(Logger));

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || configService.get<number>('API_PORT', 3001);
    const prefix = configService.get<string>('API_PREFIX', 'api');

    // ─── Security ────────────────────────────────
    app.use(helmet());

    // ─── CORS ────────────────────────────────────
    app.enableCors({
        origin: configService.get<string>('CORS_ORIGINS', 'http://localhost:3000').split(','),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    });

    // ─── Global Prefix ──────────────────────────
    app.setGlobalPrefix(prefix);

    // ─── Versioning ──────────────────────────────
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // ─── Validation Pipe ─────────────────────────
    // WHY: Reject invalid payloads before they reach business logic.
    // whitelist strips unknown properties (defense-in-depth).
    // forbidNonWhitelisted returns 400 if unknown properties are sent.
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // ─── Swagger Documentation ───────────────────
    if (configService.get<string>('NODE_ENV') !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('Sentinals API')
            .setDescription('Intelligent Monitoring & AI-powered SaaS Platform API')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication endpoints')
            .addTag('users', 'User management')
            .addTag('projects', 'Project management')
            .addTag('logs', 'Log management')
            .addTag('admin', 'Admin endpoints')
            .addTag('subscriptions', 'Subscription management')
            .build();

        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }

    await app.listen(port);

    const logger = app.get(Logger);
    logger.log(
        `🚀 Sentinals API running on http://localhost:${port}/${prefix}`,
        'Bootstrap',
    );
    logger.log(
        `📚 Swagger docs at http://localhost:${port}/docs`,
        'Bootstrap',
    );
}

bootstrap();
