import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 *
 * WHY: Edge-level route protection. Runs before page rendering.
 * Checks for auth token in cookies/localStorage (via custom header)
 * and redirects to login if missing for protected routes.
 *
 * NOTE: Since we use Zustand/localStorage, this is a soft guard.
 * The real protection is the JWT-validated API endpoints.
 * This just provides a better UX by redirecting early.
 */
const protectedRoutes = ['/dashboard', '/projects', '/settings', '/billing', '/admin'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for auth token in cookie (set by client-side hydration)
    const token = request.cookies.get('sentinals-auth-token')?.value;

    // Redirect authenticated users away from auth pages
    if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to login for protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/projects/:path*', '/settings/:path*', '/billing/:path*', '/admin/:path*', '/login', '/signup'],
};
