'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * OAuth Callback — Inner component (needs Suspense wrapper)
 *
 * Next.js 14 requires useSearchParams() to be inside a Suspense boundary
 * because it opts the page out of static generation.
 */
function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setTokens = useAuthStore((s) => s.setTokens);
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userParam = searchParams.get('user');

        if (accessToken && refreshToken && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                setTokens(accessToken, refreshToken);
                setUser(user);
                useAuthStore.setState({ isAuthenticated: true });
                toast.success(`Welcome, ${user.name}!`);
                router.replace('/dashboard');
            } catch {
                toast.error('Authentication failed. Please try again.');
                router.replace('/login');
            }
        } else {
            toast.error('Invalid authentication response.');
            router.replace('/login');
        }
    }, [searchParams, router, setTokens, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Signing you in...</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Please wait while we verify your identity
                </p>
            </div>
        </div>
    );
}

/**
 * OAuth Callback Page — wraps handler in Suspense
 */
export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            }
        >
            <CallbackHandler />
        </Suspense>
    );
}
