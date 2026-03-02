export type LogSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface Log {
    id: string;
    projectId: string;
    message: string;
    severity: LogSeverity;
    metadata?: Record<string, any>;
    timestamp: string;
}
