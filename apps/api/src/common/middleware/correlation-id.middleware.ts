import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Correlation ID Middleware
 *
 * WHY: Enables request tracing across services. Every request gets a unique
 * ID that flows through logs, error responses, and downstream calls.
 * Essential for debugging in production and distributed tracing.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
        req.headers['x-correlation-id'] = correlationId;
        res.setHeader('X-Correlation-ID', correlationId);
        next();
    }
}
