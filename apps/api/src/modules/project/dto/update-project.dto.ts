import { IsString, IsOptional, MaxLength, IsObject, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectDto {
    @ApiPropertyOptional({ example: 'Updated Project Name' })
    @IsString()
    @IsOptional()
    @MaxLength(200)
    name?: string;

    @ApiPropertyOptional({ enum: ProjectStatus })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @ApiPropertyOptional({ example: { alertThreshold: 95 } })
    @IsObject()
    @IsOptional()
    config?: Record<string, any>;
}
