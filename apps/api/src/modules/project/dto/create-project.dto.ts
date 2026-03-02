import { IsString, IsOptional, IsNotEmpty, MaxLength, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ example: 'Production API Monitor' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @ApiPropertyOptional({ example: { alertThreshold: 90, checkInterval: 60 } })
    @IsObject()
    @IsOptional()
    config?: Record<string, any>;
}
