import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    subscriptionStatus: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
}

/**
 * Auth Store (Zustand)
 *
 * WHY: Client-side auth state persisted to localStorage.
 * Zustand over Context: No re-render cascade, works outside React tree
 * (see api.ts interceptors), smaller bundle.
 *
 * SECURITY: Tokens are in localStorage (not httpOnly cookies) because
 * this is a SPA. In production with SSR, consider httpOnly cookie approach.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post('/v1/auth/login', { email, password });
                    const { user, accessToken, refreshToken } = data.data;
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post('/v1/auth/register', { name, email, password });
                    const { user, accessToken, refreshToken } = data.data;
                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            setTokens: (accessToken: string, refreshToken: string) => {
                set({ accessToken, refreshToken });
            },

            setUser: (user: User) => {
                set({ user });
            },
        }),
        {
            name: 'sentinals-auth',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
