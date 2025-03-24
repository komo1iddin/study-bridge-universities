import { createClient } from './supabase-client';
import { User } from '@supabase/supabase-js';

/**
 * Checks if a user is authenticated by verifying the current session
 * @returns A promise that resolves to the authenticated user or null
 */
export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    console.log('Checking for authenticated user...');
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    
    if (!data.session) {
      console.log('No active session found');
      return null;
    }
    
    console.log('Active session found for user:', data.session.user.id);
    return data.session.user;
  } catch (err) {
    console.error('Unexpected error checking auth session:', err);
    return null;
  }
};

/**
 * Handles redirection after authentication events
 * @param locale The current locale
 * @param redirectPath The path to redirect to (without locale prefix)
 * @param delay Optional delay in milliseconds before redirecting
 */
export const redirectWithLocale = (
  locale: string, 
  redirectPath: string = '/',
  delay: number = 500
): void => {
  // Ensure redirect path starts with a slash
  if (!redirectPath.startsWith('/')) {
    redirectPath = `/${redirectPath}`;
  }
  
  // Construct the full URL with locale
  const fullRedirectUrl = `/${locale}${redirectPath}`;
  console.log(`Will redirect to: ${fullRedirectUrl} after ${delay}ms`);
  
  // Helper to make the actual redirect
  const performRedirect = async () => {
    console.log('Executing redirect now...');
    
    try {
      // Make a final call to check authentication before redirecting
      const authStatus = await fetch('/api/auth/session');
      console.log('Auth status before redirect:', authStatus.status);
    } catch (e) {
      console.warn('Could not check auth status before redirect:', e);
    }
    
    // Keep any hash that was part of the redirectPath
    let finalUrl = fullRedirectUrl;
    let hashPart = '';
    
    if (redirectPath.includes('#')) {
      const parts = redirectPath.split('#');
      finalUrl = `/${locale}${parts[0]}`;
      hashPart = `#${parts[1]}`;
    }
    
    // Add a timestamp to the hash to force a fresh page load
    const timestamp = Date.now();
    const urlWithHash = `${finalUrl}${hashPart ? hashPart : '#'}t=${timestamp}`;
    console.log('Using URL with hash:', urlWithHash);
    
    // Force a hard navigation to ensure session is picked up by the server
    window.location.href = urlWithHash;
  };
  
  // Delay the redirect to allow for toasts and state updates
  if (delay > 0) {
    setTimeout(performRedirect, delay);
  } else {
    performRedirect();
  }
};

/**
 * Utility function to check if a user is authenticated on the client side
 * and redirect to login if not
 * @param locale The current locale
 * @param redirectAfterLogin Path to redirect to after successful login
 */
export const requireAuth = async (
  locale: string,
  redirectAfterLogin: string = window.location.pathname
): Promise<User | null> => {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    console.log('No authenticated user, redirecting to login');
    // Encode the current path to redirect back after login
    const loginPath = `/auth/login?redirect=${encodeURIComponent(redirectAfterLogin)}`;
    redirectWithLocale(locale, loginPath, 0); // No delay for auth redirects
    return null;
  }
  
  return user;
}; 