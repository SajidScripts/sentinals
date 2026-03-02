import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { QueryLogsDto } from './dto/query-logs.dto';

@ApiTags('logs')
@Controller('projects/:projectId/logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Post()
    @ApiOperation({ summary: 'Create a log entry for a project' })
    async create(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() dto: CreateLogDto,
    ) {
        return this.logService.create(projectId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Query logs for a project with filters' })
    async findAll(
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() query: QueryLogsDto,
    ) {
        return this.logService.findByProject(projectId, query);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get log statistics for a project' })
    async getStats(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.logService.getStats(projectId);
    }
}
