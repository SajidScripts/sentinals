import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LogSeverity } from '@prisma/client';

export class CreateLogDto {
    @ApiProperty({ example: 'CPU usage exceeded 90% threshold' })
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiPropertyOptional({ enum: LogSeverity, default: 'INFO' })
    @IsEnum(LogSeverity)
    @IsOptional()
    severity?: LogSeverity;

    @ApiPropertyOptional({ example: { cpu: 92, memory: 78 } })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}
