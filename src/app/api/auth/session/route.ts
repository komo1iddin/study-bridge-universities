import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  
  // Debug - log available cookies
  console.log('[Session API] Available cookies:');
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    // Only show part of cookie value for security
    const value = cookie.value;
    const displayValue = value.length > 10 ? 
      `${value.substring(0, 5)}...${value.substring(value.length - 5)}` : value;
    console.log(`- ${cookie.name}: ${displayValue}`);
  }
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          console.log(`[Session API] Getting cookie: ${name} -> ${cookie ? 'found' : 'not found'}`);
          return cookie?.value;
        },
        set(name: string, value: string, options: any) {
          console.log(`[Session API] Setting cookie: ${name} (length: ${value?.length || 0})`);
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Always set path and ensure reasonable defaults for auth cookies
              ...(name.includes('auth') ? {
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              } : {
                path: '/',
              })
            });
          } catch (error) {
            console.error(`[Session API] Failed to set cookie ${name}:`, error);
          }
        },
        remove(name: string, options: any) {
          console.log(`[Session API] Removing cookie: ${name}`);
          try {
            cookieStore.delete({
              name,
              ...options,
              path: '/' // Always ensure path is set
            });
          } catch (error) {
            console.error(`[Session API] Failed to remove cookie ${name}:`, error);
          }
        }
      }
    }
  );
  
  // Get session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[Session API] Session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  console.log('[Session API] Session check result:', session ? 'User authenticated' : 'No session');
  
  // Set auth cookie to help maintain session state
  if (session) {
    const response = NextResponse.json({ 
      user: session.user,
      expires_at: session.expires_at
    });
    
    // Set a debug cookie to help track session state
    response.cookies.set('sb-debug-session', 'true', { 
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Also set a backup session cookie with the session ID
    // This will help ensure the session is preserved even if other cookies are lost
    response.cookies.set('sb-session-id', session.user.id, {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  }
  
  // Clear debug cookies if no session
  const response = NextResponse.json({ 
    user: null,
    message: 'No active session'
  });
  
  response.cookies.set('sb-debug-session', '', { 
    maxAge: 0,
    path: '/'
  });
  
  return response;
} 