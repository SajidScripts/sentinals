import { Controller, Get, Patch, Param, Query, UseGuards, ParseUUIDPipe, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get platform-wide statistics (Admin only)' })
    async getStats() {
        return this.adminService.getPlatformStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'List all users (Admin only)' })
    async listUsers(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.adminService.listUsers(page, limit);
    }

    @Patch('users/:id/role')
    @ApiOperation({ summary: 'Update user role (Admin only)' })
    async updateRole(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('role') role: UserRole,
    ) {
        return this.adminService.updateUserRole(id, role);
    }
}
