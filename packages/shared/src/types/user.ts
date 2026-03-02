export type UserRole = 'ADMIN' | 'USER';

export type SubscriptionStatus = 'FREE' | 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}
