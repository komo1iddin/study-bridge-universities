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
  
  console.log(`[Middleware] Handling request: ${req.nextUrl.pathname}`);
  
  // DEBUGGING: Log available cookies
  console.log('[Middleware] Available cookies:');
  const cookieNames = req.cookies.getAll().map(c => c.name);
  for (const name of cookieNames) {
    const cookie = req.cookies.get(name);
    if (cookie) {
      // Only show part of cookie value for security
      const value = cookie.value;
      const displayValue = value.length > 10 ? 
        `${value.substring(0, 5)}...${value.substring(value.length - 5)}` : value;
      console.log(`- ${name}: ${displayValue}`);
    }
  }
  
  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = req.cookies.get(name);
          console.log(`[Middleware] Getting cookie: ${name} -> ${cookie ? 'found' : 'not found'}`);
          return cookie?.value;
        },
        set(name: string, value: string, options: any) {
          console.log(`[Middleware] Setting cookie: ${name}`);
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
          console.log(`[Middleware] Removing cookie: ${name}`);
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

  console.log(`[Middleware] Session check result: ${session ? `User authenticated: ${session.user.id}` : 'No session found'}`);

  const pathname = req.nextUrl.pathname;
  
  // Check if the path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(pattern => pattern.test(pathname));
  const isPublicRoute = PUBLIC_ROUTES.some(pattern => pattern.test(pathname));
  
  console.log(`[Middleware] Path: ${pathname}, Protected: ${isProtectedRoute}, Public: ${isPublicRoute}`);
  
  // Get the locale from the pathname
  const locale = pathname.split('/')[1] || 'en';
  
  // If the route is protected and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    console.log(`[Middleware] Protected route with no session, redirecting to login`);
    const redirectUrl = new URL(`/${locale}/auth/login`, req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If already logged in and trying to access login/register pages, redirect to profile
  if (session && (pathname.includes('/auth/login') || pathname.includes('/auth/register'))) {
    console.log(`[Middleware] Logged in user accessing auth page, redirecting to profile`);
    return NextResponse.redirect(new URL(`/${locale}/profile`, req.url));
  }
  
  console.log(`[Middleware] Allowing request to proceed`);
  return res;
}

export const config = {
  matcher: [
    // Exclude files with a dot, API routes, and static assets
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}; 