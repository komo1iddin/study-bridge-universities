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
        flowType: 'pkce',
        debug: true,
        storageKey: 'sb-auth-token',
        storage: {
          getItem: (key) => {
            try {
              const value = localStorage.getItem(key);
              console.log('[Supabase] Getting storage item:', { key, exists: !!value });
              return value;
            } catch (err) {
              console.error('[Supabase] Error getting from storage:', err);
              return null;
            }
          },
          setItem: (key, value) => {
            try {
              console.log('[Supabase] Setting storage item:', { key, hasValue: !!value });
              localStorage.setItem(key, value);
            } catch (err) {
              console.error('[Supabase] Error setting to storage:', err);
            }
          },
          removeItem: (key) => {
            try {
              console.log('[Supabase] Removing storage item:', { key });
              localStorage.removeItem(key);
            } catch (err) {
              console.error('[Supabase] Error removing from storage:', err);
            }
          }
        }
      }
    }
  );
} 