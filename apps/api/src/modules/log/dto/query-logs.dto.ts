import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LogSeverity } from '@prisma/client';

export class QueryLogsDto {
    @ApiPropertyOptional({ enum: LogSeverity })
    @IsEnum(LogSeverity)
    @IsOptional()
    severity?: LogSeverity;

    @ApiPropertyOptional({ example: '2024-01-01T00:00:00Z' })
    @IsDateString()
    @IsOptional()
    from?: string;

    @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
    @IsDateString()
    @IsOptional()
    to?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ default: 50 })
    @IsOptional()
    limit?: number;
}
