export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    statusCode: number;
    error: string;
    message: string | string[];
    timestamp: string;
    path: string;
    correlationId?: string;
}
