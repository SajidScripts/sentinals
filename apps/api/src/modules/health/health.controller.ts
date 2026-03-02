import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '@/database/prisma.service';
import { RedisService } from '@/database/redis.service';

@ApiTags('health')
@Controller('health')
@SkipThrottle()
export class HealthController {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Health check' })
    async check() {
        const checks: Record<string, string> = {
            api: 'ok',
            database: 'unknown',
            redis: 'unknown',
        };

        // Check PostgreSQL
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            checks.database = 'ok';
        } catch {
            checks.database = 'error';
        }

        // Check Redis
        try {
            const healthy = await this.redis.isHealthy();
            checks.redis = healthy ? 'ok' : 'error';
        } catch {
            checks.redis = 'error';
        }

        const allHealthy = Object.values(checks).every((v) => v === 'ok');

        return {
            status: allHealthy ? 'healthy' : 'degraded',
            checks,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
