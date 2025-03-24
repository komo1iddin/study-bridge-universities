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
          console.log(`[Session API] Setting cookie: ${name}`);
          try {
            cookieStore.set({
              name,
              value,
              ...options
            });
          } catch (error) {
            console.error(`[Session API] Failed to set cookie ${name}:`, error);
          }
        },
        remove(name: string, options: any) {
          console.log(`[Session API] Removing cookie: ${name}`);
          try {
            cookieStore.delete(name);
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
      path: '/'
    });
    
    return response;
  }
  
  return NextResponse.json({ 
    user: null,
    message: 'No active session'
  });
} 