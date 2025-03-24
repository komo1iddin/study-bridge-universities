import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { type CookieOptions } from '@supabase/ssr';

// This middleware handles i18n routing and admin authentication
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Locale prefix strategy - use always to avoid redirect loops
  localePrefix: 'always',
  
  // Normalize pathnames to avoid inconsistencies
  pathnames: {
    '/': '/',
    '/programs': '/programs',
    '/programs/[id]': '/programs/[id]',
    '/universities': '/universities',
    '/universities/[id]': '/universities/[id]',
    '/scholarships': '/scholarships',
    '/about': '/about',
    '/contact': '/contact',
    '/faq': '/faq',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/admin': '/admin',
    '/admin/login': '/admin/login',
    '/admin/universities': '/admin/universities',
    '/admin/universities/[id]': '/admin/universities/[id]',
    '/admin/universities/new': '/admin/universities/new',
    '/admin/programs': '/admin/programs',
    '/admin/programs/[id]': '/admin/programs/[id]',
    '/admin/programs/new': '/admin/programs/new',
    '/admin/scholarships': '/admin/scholarships',
    '/admin/scholarships/[id]': '/admin/scholarships/[id]',
    '/admin/scholarships/new': '/admin/scholarships/new',
    '/admin/users': '/admin/users',
    '/admin/users/[id]': '/admin/users/[id]',
    '/admin/users/new': '/admin/users/new',
    '/admin/settings': '/admin/settings',
  }
});

// Admin route authentication check
export async function middleware(request: NextRequest) {
  // Extract the pathname for debugging
  const pathname = request.nextUrl.pathname;
  
  // Skip if this is a result of redirecting to /en/en (infinite loop prevention)
  if (pathname.match(/^\/[a-z]{2}\/[a-z]{2}(\/|$)/)) {
    console.log('Detected double locale pattern, preventing redirect loop:', pathname);
    // Fix by redirecting to the single locale pattern
    const correctedPath = pathname.replace(/^\/([a-z]{2})\/[a-z]{2}(\/|$)/, '/$1$2');
    console.log('Redirecting to corrected path:', correctedPath);
    return NextResponse.redirect(new URL(correctedPath, request.url));
  }
  
  // Handle internationalization first
  const response = intlMiddleware(request);
  
  // Extract the clean path (without locale prefix) for authentication check
  const pathnameWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');
  
  // Add more debug logging
  console.log('====== MIDDLEWARE DEBUG ======');
  console.log('Request URL:', request.url);
  console.log('Next URL:', request.nextUrl.toString());
  console.log('Origin:', request.nextUrl.origin);
  console.log('Host:', request.headers.get('host'));
  console.log('Protocol:', request.headers.get('x-forwarded-proto') || 'http');
  console.log('Pathname:', pathname);
  console.log('Pathname without locale:', pathnameWithoutLocale);
  console.log('Locale:', request.nextUrl.locale);
  console.log('====== END MIDDLEWARE DEBUG ======');
  
  // Check if this is an admin route that needs protection
  if (pathnameWithoutLocale.startsWith('/admin')) {
    console.log('Admin route detected:', pathname);
    
    // Skip authentication check for admin login page
    if (pathnameWithoutLocale === '/admin/login') {
      console.log('Admin login page detected, skipping auth check');
      return response;
    }
    
    // Special check for the my.main@example.com case in the cookies before creating the Supabase client
    try {
      // Check if this is a request coming from our special admin with cookies
      const adminAuthCookie = request.cookies.get('admin-auth-token');
      const adminEmail = request.cookies.get('admin-user-email');
      const adminTimestamp = request.cookies.get('admin-auth-timestamp');
      
      const isSpecialAdminCookie = adminAuthCookie?.value === 'my.main@example.com' || 
                                adminEmail?.value === 'my.main@example.com';
                                
      if (isSpecialAdminCookie) {
        console.log('Special admin cookie detected:', { 
          auth: adminAuthCookie?.value?.substring(0, 10) + '...',
          email: adminEmail?.value?.substring(0, 10) + '...',
          timestamp: adminTimestamp?.value
        });
        
        // Set special header for internal use
        response.headers.set('x-admin-authorized', 'true');
        
        // Check if cookie was refreshed recently to avoid excessive refreshes
        if (adminTimestamp) {
          const timestamp = parseInt(adminTimestamp.value, 10);
          const now = Date.now();
          const age = now - timestamp;
          
          // Only refresh cookies if they're older than 6 hours AND not refreshed in the last minute
          // This prevents multiple refreshes in quick succession
          if (age > 1000 * 60 * 60 * 6 && age > 1000 * 60) {
            console.log('Admin cookie is old, refreshing it');
            response.cookies.set('admin-auth-timestamp', now.toString(), {
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 1 week
              httpOnly: false
            });
          } else {
            console.log('Admin cookie is recent, not refreshing to prevent loops');
          }
        } else {
          // If there's no timestamp, add one without triggering a refresh loop
          response.cookies.set('admin-auth-timestamp', Date.now().toString(), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: false
          });
        }
        
        // Only add missing cookies - don't update existing ones to prevent loops
        if (!adminAuthCookie) {
          console.log('Setting missing admin-auth-token cookie');
          response.cookies.set('admin-auth-token', 'my.main@example.com', {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: false
          });
        }
        
        if (!adminEmail) {
          console.log('Setting missing admin-user-email cookie');
          response.cookies.set('admin-user-email', 'my.main@example.com', {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: false
          });
        }
        
        console.log('Special admin access granted via cookies, bypassing regular auth check');
        return response;
      }
    } catch (err) {
      console.error('Error checking for special admin cookies:', err);
    }
    
    // Create Supabase client for auth check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // This is used for setting cookies in the response later
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.delete({
              name,
              ...options,
            });
          },
        },
      }
    );

    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
      console.log('No session found, redirecting to admin login page');
      
      // Get the origin to ensure a complete URL
      // If origin is not available or is 'null', construct it from headers
      let origin = request.nextUrl.origin;
      if (!origin || origin === 'null') {
        // Try to construct the origin from headers
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        origin = `${protocol}://${host}`;
        console.log('Constructed origin from headers:', origin);
      }
      
      const locale = request.nextUrl.locale || 'en';
      
      // Create a completely explicit URL for redirection
      const loginPath = `${origin}/${locale}/admin/login`;
      const redirectUrl = new URL(loginPath);
      
      // Add the original path as a redirect parameter (without locale prefix)
      redirectUrl.searchParams.set('redirect', pathnameWithoutLocale);
      
      const finalRedirectUrl = redirectUrl.toString();
      console.log('Redirecting to full URL:', finalRedirectUrl);
      
      // Use explicit toString() to ensure we get the complete URL string
      return NextResponse.redirect(finalRedirectUrl, 307);
    }
    
    // Get user metadata to check role
    const { data: userData } = await supabase.auth.getUser();
    
    // Special check for the main admin email
    const isMainAdminEmail = userData?.user?.email === 'my.main@example.com';
    if (isMainAdminEmail) {
      console.log('Special admin access granted for target email:', userData?.user?.email);
      
      // Set admin cookies for future requests
      response.cookies.set('admin-auth-token', 'my.main@example.com', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false
      });
      
      response.cookies.set('admin-user-email', 'my.main@example.com', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false
      });
      
      // Store a valid UUID for the admin user ID
      response.cookies.set('admin-user-id', '00000000-0000-4000-a000-000000000000', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false
      });
      
      response.cookies.set('admin-auth-timestamp', Date.now().toString(), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false
      });
      
      // Set special header
      response.headers.set('x-admin-authorized', 'true');
      
      // Additional steps to ensure metadata is set correctly for the special admin
      try {
        // Check if the metadata doesn't have admin role yet
        if (!userData?.user?.user_metadata?.role || userData.user.user_metadata.role !== 'admin') {
          console.log('Updating metadata for special admin user');
          // This update won't be available immediately but will be on next request
          await supabase.auth.updateUser({
            data: { 
              role: 'admin',
              is_admin: true 
            }
          });
        }
      } catch (err) {
        console.error('Error updating admin metadata:', err);
      }
      
      return response;
    }
    
    // If user is not an admin or manager, redirect to home
    if (!userData?.user?.user_metadata?.role || 
        (userData.user.user_metadata.role !== 'admin' && userData.user.user_metadata.role !== 'manager')) {
      console.log('User does not have admin rights:', userData?.user?.email);
      return NextResponse.redirect(new URL(`/${request.nextUrl.locale}`, request.url));
    }
    
    console.log('Admin auth check passed for:', userData?.user?.email);
  }
  
  return response;
}

export const config = {
  // Skip all paths that should not be internationalized or auth-checked
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 