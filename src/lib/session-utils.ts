import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

/**
 * Checks if a user is authenticated by verifying the current session
 * @returns A promise that resolves to the authenticated user or null
 */
export const getAuthenticatedUser = async (): Promise<User | null> => {
  try {
    console.log('Checking for authenticated user...');
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
  
  // Delay the redirect to allow for toasts and state updates
  setTimeout(() => {
    console.log('Executing redirect now...');
    
    // DEBUGGING: Add a special hash to track redirects
    const urlWithDebugInfo = `${fullRedirectUrl}#auth_redirect_${Date.now()}`;
    console.log('Using URL with debug info:', urlWithDebugInfo);
    
    // Force a hard navigation to ensure session is picked up by the server
    window.location.href = urlWithDebugInfo;
  }, delay);
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