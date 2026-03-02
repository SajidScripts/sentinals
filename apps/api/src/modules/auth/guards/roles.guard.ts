import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Roles Guard
 *
 * WHY: Enforces role-based access control at the controller/handler level.
 * Uses the @Roles() decorator metadata to determine required roles.
 * If no roles are specified, the route is accessible to any authenticated user.
 *
 * HIERARCHY: None. This is strict role matching, not hierarchical.
 * An ADMIN must be explicitly granted ADMIN role.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // No roles specified = any authenticated user can access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        const hasRole = requiredRoles.some((role) => user.role === role);

        if (!hasRole) {
            throw new ForbiddenException(
                `Insufficient permissions. Required role: ${requiredRoles.join(' or ')}`,
            );
        }

        return true;
    }
}
