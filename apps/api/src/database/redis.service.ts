import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * RedisService
 *
 * WHY: Centralized Redis client with health checks, graceful shutdown,
 * and abstracted get/set/del for caching patterns.
 *
 * CACHING STRATEGY:
 * - Session tokens: 15min TTL (matches JWT expiration)
 * - Dashboard aggregates: 30s TTL (near-real-time)
 * - User profiles: 5min TTL (rarely changes)
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(private configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');

        this.client = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            retryStrategy: (times) => {
                if (times > 3) {
                    this.logger.error('Redis connection failed after 3 retries');
                    return null; // Stop retrying
                }
                return Math.min(times * 200, 2000);
            },
        });

        this.client.on('connect', () => this.logger.log('Redis connected'));
        this.client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));

        this.client.connect().catch((err) => {
            this.logger.warn(`Redis connection failed: ${err.message}. Caching will be disabled.`);
        });
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch {
            this.logger.warn(`Redis GET failed for key: ${key}`);
            return null;
        }
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        try {
            if (ttlSeconds) {
                await this.client.setex(key, ttlSeconds, value);
            } else {
                await this.client.set(key, value);
            }
        } catch {
            this.logger.warn(`Redis SET failed for key: ${key}`);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch {
            this.logger.warn(`Redis DEL failed for key: ${key}`);
        }
    }

    async isHealthy(): Promise<boolean> {
        try {
            const result = await this.client.ping();
            return result === 'PONG';
        } catch {
            return false;
        }
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
