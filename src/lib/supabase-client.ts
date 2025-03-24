import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client with consistent configuration for client-side components
 * This should be used in all browser components for consistency
 */
export function createClient() {
  console.log('[Client] Creating Supabase browser client');
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    }
  );
} 