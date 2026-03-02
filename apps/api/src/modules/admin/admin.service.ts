import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { RedisService } from '@/database/redis.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    async getPlatformStats() {
        // Check cache
        const cached = await this.redis.get('admin:stats');
        if (cached) return JSON.parse(cached);

        const [totalUsers, totalProjects, totalLogs, usersByRole, usersBySubscription] =
            await Promise.all([
                this.prisma.user.count(),
                this.prisma.project.count(),
                this.prisma.log.count(),
                this.prisma.user.groupBy({ by: ['role'], _count: true }),
                this.prisma.user.groupBy({ by: ['subscriptionStatus'], _count: true }),
            ]);

        const stats = {
            totalUsers,
            totalProjects,
            totalLogs,
            usersByRole: usersByRole.reduce(
                (acc, item) => ({ ...acc, [item.role]: item._count }),
                {},
            ),
            usersBySubscription: usersBySubscription.reduce(
                (acc, item) => ({ ...acc, [item.subscriptionStatus]: item._count }),
                {},
            ),
        };

        // Cache for 30 seconds
        await this.redis.set('admin:stats', JSON.stringify(stats), 30);

        return stats;
    }

    async listUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    subscriptionStatus: true,
                    createdAt: true,
                    _count: { select: { projects: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data: users,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async updateUserRole(id: string, role: UserRole) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        const updated = await this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });

        await this.redis.del(`user:${id}`);

        return updated;
    }
}
