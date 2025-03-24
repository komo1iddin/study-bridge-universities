import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Create a Supabase client configured to use the environment variables
 * with explicit auth persistence settings
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Store session data in both cookies and localStorage for redundancy
      storageKey: 'supabase_auth_token',
      storage: {
        getItem: (key) => {
          // Try localStorage first (client-side only)
          if (typeof window !== 'undefined') {
            const value = localStorage.getItem(key);
            if (value) {
              console.log(`[Supabase Storage] Got item from localStorage: ${key} (length: ${value.length})`);
              return value;
            }
          }
          
          // If no value in localStorage, try cookies (might work better for cross-domain)
          if (typeof document !== 'undefined') {
            const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
            if (match) {
              console.log(`[Supabase Storage] Got item from cookies: ${key}`);
              return match[2];
            }
          }
          
          console.log(`[Supabase Storage] No item found: ${key}`);
          return null;
        },
        setItem: (key, value) => {
          console.log(`[Supabase Storage] Setting item: ${key} (length: ${value?.length || 0})`);
          
          // Store in localStorage (client-side only)
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(key, value);
              console.log(`[Supabase Storage] Set item in localStorage: ${key}`);
            } catch (e) {
              console.warn(`[Supabase Storage] Failed to set item in localStorage: ${e}`);
            }
          }
          
          // Also store in cookies for redundancy
          if (typeof document !== 'undefined') {
            try {
              // Set a cookie that expires in 24 hours (extending from 12 hours)
              const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
              document.cookie = `${key}=${value}; expires=${expires}; path=/; SameSite=Lax`;
              console.log(`[Supabase Storage] Set item in cookies: ${key} (expires: ${expires})`);
            } catch (e) {
              console.warn(`[Supabase Storage] Failed to set cookie: ${e}`);
            }
          }
        },
        removeItem: (key) => {
          console.log(`[Supabase Storage] Removing item: ${key}`);
          
          // Remove from localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem(key);
              console.log(`[Supabase Storage] Removed item from localStorage: ${key}`);
            } catch (e) {
              console.warn(`[Supabase Storage] Failed to remove from localStorage: ${e}`);
            }
          }
          
          // Remove from cookies
          if (typeof document !== 'undefined') {
            try {
              document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
              console.log(`[Supabase Storage] Removed item from cookies: ${key}`);
            } catch (e) {
              console.warn(`[Supabase Storage] Failed to remove cookie: ${e}`);
            }
          }
        },
      },
    },
  }
); 