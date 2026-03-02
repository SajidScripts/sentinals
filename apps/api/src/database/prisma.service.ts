import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService
 *
 * WHY: Manages Prisma client lifecycle within NestJS DI container.
 * Implements graceful shutdown to prevent connection leaks.
 * Extended logging in development for query debugging.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log:
                process.env.NODE_ENV === 'production'
                    ? ['error', 'warn']
                    : ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
