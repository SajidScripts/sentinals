import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectService.create(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all projects for current user' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async findAll(
        @CurrentUser('id') userId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.projectService.findAll(userId, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a project by ID' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.projectService.findOne(id, userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectService.update(id, userId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.projectService.remove(id, userId);
    }
}
