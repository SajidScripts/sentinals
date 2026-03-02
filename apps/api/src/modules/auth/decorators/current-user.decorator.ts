import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() decorator
 *
 * WHY: Extracts the authenticated user from request.user
 * (set by JwtAuthGuard/Passport). Cleaner than req.user everywhere.
 */
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (data) {
            return user?.[data];
        }

        return user;
    },
);
