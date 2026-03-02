import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateLogDto } from './dto/create-log.dto';
import { QueryLogsDto } from './dto/query-logs.dto';

/**
 * Log Service
 *
 * WHY: Structured log ingestion and query for monitored projects.
 * Supports severity filtering and time-range queries.
 *
 * INDEXING: The Prisma schema has compound indexes on
 * (projectId, timestamp DESC) and (projectId, severity)
 * to support the two primary query patterns.
 */
@Injectable()
export class LogService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, dto: CreateLogDto) {
        return this.prisma.log.create({
            data: {
                projectId,
                message: dto.message,
                severity: dto.severity || 'INFO',
                metadata: dto.metadata || undefined,
            },
        });
    }

    async findByProject(projectId: string, query: QueryLogsDto) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 50, 100); // Cap at 100
        const skip = (page - 1) * limit;

        const where: Prisma.LogWhereInput = {
            projectId,
            ...(query.severity && { severity: query.severity }),
            ...(query.from || query.to
                ? {
                    timestamp: {
                        ...(query.from && { gte: new Date(query.from) }),
                        ...(query.to && { lte: new Date(query.to) }),
                    },
                }
                : {}),
        };

        const [logs, total] = await Promise.all([
            this.prisma.log.findMany({
                where,
                skip,
                take: limit,
                orderBy: { timestamp: 'desc' },
            }),
            this.prisma.log.count({ where }),
        ]);

        return {
            data: logs,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async getStats(projectId: string) {
        const [total, bySeverity] = await Promise.all([
            this.prisma.log.count({ where: { projectId } }),
            this.prisma.log.groupBy({
                by: ['severity'],
                where: { projectId },
                _count: true,
            }),
        ]);

        return {
            total,
            bySeverity: bySeverity.reduce(
                (acc, item) => ({ ...acc, [item.severity]: item._count }),
                {},
            ),
        };
    }
}
