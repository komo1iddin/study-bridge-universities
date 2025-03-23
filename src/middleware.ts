import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PUBLIC_ROUTES = [
  // Locale home pages
  /^\/[a-z]{2}$/,
  /^\/[a-z]{2}\/$/,
  
  // Auth routes
  /^\/[a-z]{2}\/auth\/login$/,
  /^\/[a-z]{2}\/auth\/register$/,
  
  // Public pages
  /^\/[a-z]{2}\/universities(\/.*)?$/,
  /^\/[a-z]{2}\/programs(\/.*)?$/,
  /^\/[a-z]{2}\/scholarships(\/.*)?$/,
  /^\/[a-z]{2}\/about(\/.*)?$/,
  /^\/[a-z]{2}\/contact(\/.*)?$/,
  
  // API routes
  /^\/api\/.*/,
];

const PROTECTED_ROUTES = [
  /^\/[a-z]{2}\/profile(\/.*)?$/,
  /^\/[a-z]{2}\/applications(\/.*)?$/,
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.delete({
            name,
            ...options,
          });
          res.cookies.delete({
            name,
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  
  // Check if the path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(pattern => pattern.test(pathname));
  const isPublicRoute = PUBLIC_ROUTES.some(pattern => pattern.test(pathname));
  
  // Get the locale from the pathname
  const locale = pathname.split('/')[1] || 'en';
  
  // If the route is protected and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL(`/${locale}/auth/login`, req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If already logged in and trying to access login/register pages, redirect to profile
  if (session && (pathname.includes('/auth/login') || pathname.includes('/auth/register'))) {
    return NextResponse.redirect(new URL(`/${locale}/profile`, req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    // Exclude files with a dot, API routes, and static assets
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}; 