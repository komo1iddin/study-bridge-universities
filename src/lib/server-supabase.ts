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
          console.log(`[Server] Setting cookie: ${name} (in server component - may not work)`);
          // This may not work in all server components, especially in RSC
        },
        remove(name: string, options: any) {
          console.log(`[Server] Removing cookie: ${name} (in server component - may not work)`);
          // This may not work in all server components, especially in RSC
        },
      },
    }
  );
}
