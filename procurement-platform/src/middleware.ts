import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get session
  const { data: { session } } = await supabase.auth.getSession();

  // Get the pathname
  const { pathname } = req.nextUrl;

  // Check if the route is protected
  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/procurement/create') ||
    pathname.startsWith('/profile');

  // Check if the route is admin-only
  const isAdminRoute = pathname.startsWith('/admin');

  // Check if the route is auth-related
  const isAuthRoute =
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/auth/signup') ||
    pathname.startsWith('/auth/reset-password');

  // If the user is signed in and tries to access auth routes, redirect to dashboard
  if (session && isAuthRoute) {
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the route is protected and the user is not signed in, redirect to sign in
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the route is admin-only, check if the user has admin role
  if (isAdminRoute && session) {
    const userRole = session.user?.user_metadata?.role;

    if (userRole !== 'admin') {
      // Redirect non-admin users to the home page
      const redirectUrl = new URL('/', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/procurement/create/:path*',
    '/procurement/:id/submit/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};
