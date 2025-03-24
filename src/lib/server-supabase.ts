import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase server client with consistent configuration
 * and detailed debugging for troubleshooting authentication issues
 */
export async function createServerSupabaseClient() {
  console.log('[Server] Creating Supabase server client');
  
  const cookieStore = await cookies();
  
  // Log all available cookies for debugging
  console.log('[Server] Available cookies:');
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    // Only show part of cookie value for security
    const value = cookie.value;
    const displayValue = value.length > 10 ? 
      `${value.substring(0, 5)}...${value.substring(value.length - 5)}` : value;
    console.log(`- ${cookie.name}: ${displayValue}`);
  }
  
  // Create and return the server client
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          const found = !!cookie;
          console.log(`[Server] Getting cookie: ${name} -> ${found ? 'found' : 'not found'}`);
          return cookie?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            // In server-side context, we can only set cookies via the Response
            // but we can log for debugging purposes
            console.log(`[Server] Setting cookie: ${name} (value length: ${value?.length || 0})`);
            
            // Try to persist this for future requests by setting it in the cookie store
            cookieStore.set({
              name,
              value,
              ...options,
              // Extend cookie lifetime to help with session persistence
              // Only do this for auth tokens
              ...(name.includes('auth') ? {
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              } : {})
            });
          } catch (e) {
            console.error(`[Server] Failed to set cookie ${name}:`, e);
          }
        },
        remove(name: string, options: any) {
          try {
            console.log(`[Server] Removing cookie: ${name}`);
            cookieStore.delete({
              name,
              ...options,
              path: '/'
            });
          } catch (e) {
            console.error(`[Server] Failed to remove cookie ${name}:`, e);
          }
        },
      },
    }
  );
}
