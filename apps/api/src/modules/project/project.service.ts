import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * Project Service
 *
 * WHY: All project operations are scoped to the authenticated user.
 * This prevents cross-user data access at the service layer
 * (defense in depth — not just relying on controller guards).
 */
@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateProjectDto) {
        return this.prisma.project.create({
            data: {
                ...dto,
                userId,
                config: dto.config || {},
            },
        });
    }

    async findAll(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    _count: { select: { logs: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.project.count({ where: { userId } }),
        ]);

        return {
            data: projects,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findOne(id: string, userId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                _count: { select: { logs: true } },
            },
        });

        if (!project) throw new NotFoundException('Project not found');
        if (project.userId !== userId) throw new ForbiddenException('Access denied');

        return project;
    }

    async update(id: string, userId: string, dto: UpdateProjectDto) {
        await this.findOne(id, userId); // Ownership check

        return this.prisma.project.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId); // Ownership check

        await this.prisma.project.delete({ where: { id } });
        return { deleted: true };
    }
}
