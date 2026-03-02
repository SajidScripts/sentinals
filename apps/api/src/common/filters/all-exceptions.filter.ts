import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP Exception Filter
 *
 * WHY: Centralizes error response formatting. Every error that leaves
 * the API has a consistent structure. Logs full error context for
 * debugging while returning safe messages to clients.
 *
 * SECURITY: Never leaks stack traces or internal details to clients
 * in production. Correlation ID links client errors to server logs.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: string | string[];
        let error: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exResponse = exception.getResponse();

            if (typeof exResponse === 'object' && exResponse !== null) {
                const res = exResponse as Record<string, any>;
                message = res.message || exception.message;
                error = res.error || 'Error';
            } else {
                message = exception.message;
                error = 'Error';
            }
        } else if (exception instanceof Error) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            error = 'Internal Server Error';

            // Log full error for internal debugging
            this.logger.error(
                `Unhandled exception: ${exception.message}`,
                exception.stack,
                `${request.method} ${request.url}`,
            );
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            error = 'Internal Server Error';
        }

        const errorResponse = {
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId: request.headers['x-correlation-id'] || null,
        };

        // Log 4xx errors as warnings, 5xx as errors
        if (status >= 500) {
            this.logger.error(errorResponse, `${request.method} ${request.url}`);
        } else if (status >= 400) {
            this.logger.warn(errorResponse, `${request.method} ${request.url}`);
        }

        response.status(status).json(errorResponse);
    }
}
