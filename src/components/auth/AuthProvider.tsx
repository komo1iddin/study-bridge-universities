'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { User as AuthUser } from '@supabase/supabase-js'; 
import { User } from '@/types/database.types';
import { useRouter } from '@/i18n/utils';
import { getUserProfile } from '@/lib/auth';

type AuthContextType = {
  user: AuthUser | null;
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to safely extract error information
  const safeGetErrorInfo = (error: any): { message: string, code?: string, details?: string, hint?: string } => {
    if (!error) return { message: 'Unknown error (empty error object)' };
    
    try {
      // If it's a string, return it directly
      if (typeof error === 'string') return { message: error };
      
      // If it has a message property, use that
      if (error.message) return { 
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      };
      
      // If we can stringify it, do so
      return { message: JSON.stringify(error) };
    } catch (e) {
      // If all else fails
      return { message: 'Error object cannot be processed' };
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    
    try {
      // Try to get the profile directly from the database first
      // This should now work since we've fixed the RLS policy
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // If there's an error or no profile, try the API as a fallback
      if (profileError || !profileData) {
        // If the error is NOT the RLS recursion error, log it
        if (profileError && profileError.code !== '42P17') {
          console.log('Direct profile query failed:', safeGetErrorInfo(profileError));
          console.log('Falling back to API method...');
        }
        
        // First check if the profile exists before trying to create it
        try {
          const { data: existingProfile, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (existingProfile) {
            console.log('Found existing profile on second attempt:', existingProfile);
            setProfile(existingProfile);
            return;
          }
          
          // Fallback to the API method only if profile doesn't exist
          console.log('Fetching user profile via API for userId:', user.id);
          
          // Add a timeout to the fetch to prevent it from hanging indefinitely
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch('/api/auth/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              userData: {
                email: user.email,
                role: 'client',
              },
            }),
            signal: controller.signal,
          }).finally(() => {
            clearTimeout(timeoutId);
          });
          
          console.log('API Response status:', response.status);
          
          if (response.ok) {
            const responseText = await response.text();
            console.log('API Response text:', responseText);
            
            let result;
            try {
              result = JSON.parse(responseText);
              console.log('Parsed result:', result);
            } catch (parseError) {
              console.error('Failed to parse API response:', parseError);
              throw new Error(`Failed to parse API response: ${responseText}`);
            }
            
            if (result && result.profile) {
              console.log('Setting profile from API result:', result.profile);
              setProfile(result.profile);
              return;
            } else {
              console.error('API response missing profile data:', result);
              throw new Error('Profile API call succeeded but returned no profile data');
            }
          } else {
            // Log the response details to help diagnose the issue
            console.error('API Error status:', response.status, response.statusText);
            
            // Attempt to read the response even if not OK
            try {
              const errorText = await response.text();
              console.error('API Error text:', errorText);
              
              let errorMessage = `Failed to fetch/create profile: ${response.status}`;
              try {
                const errorJson = JSON.parse(errorText);
                if (errorJson && errorJson.error) {
                  errorMessage = errorJson.error;
                }
              } catch (e) {
                // If we can't parse JSON, use the status and text
                errorMessage = `${errorMessage} - ${errorText || response.statusText}`;
              }
              throw new Error(errorMessage);
            } catch (readError) {
              // If we failed to read the response, still throw a detailed error
              const msg = `API Error (${response.status}): Could not read response body - ${(readError as Error).message}`;
              console.error(msg);
              throw new Error(msg);
            }
          }
        } catch (apiError) {
          // Enhanced error handling with full details for debugging
          const errorInfo = safeGetErrorInfo(apiError);
          console.error('Error using profile API:', errorInfo);
          console.error('Original error object:', apiError);
          
          if (apiError instanceof TypeError && apiError.message.includes('fetch')) {
            setError('Network error connecting to profile API. Please check your connection.');
          } else if (apiError instanceof DOMException && apiError.name === 'AbortError') {
            setError('Profile API request timed out. Please try again.');
          } else {
            setError(errorInfo.message || 'Unknown error contacting profile API');
          }
          return;
        }
      } else {
        // Profile found directly from the database
        setProfile(profileData);
        return;
      }
    } catch (err) {
      const errorInfo = safeGetErrorInfo(err);
      console.error('Unexpected error in profile workflow:', errorInfo);
      setError(errorInfo.message);
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    // Initial auth state check
    const checkUser = async () => {
      try {
        console.log('Checking initial auth session...');
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user || null;
        console.log('Initial session check:', sessionUser ? 'User authenticated' : 'No user session');
        setUser(sessionUser);
      } catch (err) {
        console.error('Error checking auth session:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        
        if (session?.user) {
          console.log('User present in session after', event, 'event');
          setUser(session.user);
        } else {
          console.log('No user in session after', event, 'event');
          setUser(null);
        }
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          console.log('User signed in or updated, refreshing app state');
          router.refresh();
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing profile and refreshing app');
          setProfile(null);
          router.refresh();
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listener subscription');
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Fetch user profile when user changes
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      error,
      refreshProfile,
    }),
    [user, profile, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}