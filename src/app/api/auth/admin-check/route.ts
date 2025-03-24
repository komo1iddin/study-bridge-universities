import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// API endpoint to check admin authentication status
export async function GET(req: NextRequest) {
  console.log('[API] Admin check request received');
  
  // Get all cookies for diagnostic purposes
  const cookieList: {name: string, value: string}[] = [];
  req.cookies.getAll().forEach(cookie => {
    // Sanitize sensitive cookie values
    let sanitizedValue = cookie.name.includes('token') || 
                       cookie.name.includes('auth') ? 
                       '***REDACTED***' : 
                       cookie.value.substring(0, 5) + '...';
    
    cookieList.push({
      name: cookie.name,
      value: sanitizedValue
    });
  });
  
  try {
    // Create Supabase client using cookies from the request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Read-only in this context
          },
          remove(name: string, options: any) {
            // Read-only in this context
          },
        },
      }
    );
    
    // Check for admin cookies
    const adminAuthCookie = req.cookies.get('admin-auth-token')?.value;
    const adminEmailCookie = req.cookies.get('admin-user-email')?.value;
    const hasSpecialAdminCookies = adminAuthCookie === 'my.main@example.com' || 
                                adminEmailCookie === 'my.main@example.com';
    
    // Check the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Get user if available
    let userData = null;
    let isAdmin = false;
    let userRole = null;
    
    if (session) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (user) {
        // Extract key user information
        userData = {
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'none',
          isAdmin: user.user_metadata?.is_admin || false
        };
        
        userRole = user.user_metadata?.role;
        isAdmin = user.email === 'my.main@example.com' || 
                userRole === 'admin' || 
                user.user_metadata?.is_admin === true;
      }
    }
    
    // Create response with admin check details
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      hasSession: !!session,
      isAdmin,
      specialAdminCookies: {
        present: hasSpecialAdminCookies,
        adminAuthCookie: !!adminAuthCookie,
        adminEmailCookie: !!adminEmailCookie
      },
      user: userData,
      cookies: {
        count: cookieList.length,
        items: cookieList
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production'
      }
    });
  } catch (error) {
    console.error('[API] Error in admin check:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 