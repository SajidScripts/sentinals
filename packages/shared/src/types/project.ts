export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface Project {
    id: string;
    userId: string;
    name: string;
    status: ProjectStatus;
    config: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
