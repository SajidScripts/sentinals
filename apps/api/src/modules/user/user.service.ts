import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { RedisService } from '@/database/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) { }

    async findById(id: string) {
        // Check cache first
        const cached = await this.redis.get(`user:${id}`);
        if (cached) return JSON.parse(cached);

        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                subscriptionStatus: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { projects: true } },
            },
        });

        if (!user) throw new NotFoundException('User not found');

        // Cache for 5 minutes
        await this.redis.set(`user:${id}`, JSON.stringify(user), 300);

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                subscriptionStatus: true,
                avatarUrl: true,
                updatedAt: true,
            },
        });

        // Invalidate cache
        await this.redis.del(`user:${id}`);

        return user;
    }

    async findAll(page = 1, limit = 20) {
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
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
