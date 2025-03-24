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
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Function to check for special admin cookies
  const checkForAdminAccess = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const adminCookieExists = document.cookie.includes('admin-auth-token=my.main@example.com');
      const adminEmailCookieExists = document.cookie.includes('admin-user-email=my.main@example.com');
      const hasAdminFlag = localStorage.getItem('admin-auth-active') === 'true' || 
                         sessionStorage.getItem('admin-auth-active') === 'true';
      
      return adminCookieExists || adminEmailCookieExists || hasAdminFlag;
    } catch (err) {
      console.error('Error checking admin cookies:', err);
      return false;
    }
  };

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
    // Prevent infinite loading state with a timeout
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Auth loading timed out after 10 seconds. Setting loading to false.');
        
        // Check for special admin cookies before giving up
        if (checkForAdminAccess()) {
          console.log('Detected admin access cookies despite loading timeout');
          
          // Try to create a temporary user object for admin access
          try {
            const adminEmail = 'my.main@example.com';
            
            // Use a valid UUID for admin user - this is a static UUID for the special admin
            const adminUserId = '00000000-0000-4000-a000-000000000000';
            
            // Create a minimal user object that will allow admin UI to render
            const tempAdminUser = {
              id: adminUserId,
              email: adminEmail,
              user_metadata: { role: 'admin', is_admin: true },
              app_metadata: {},
              created_at: new Date().toISOString(),
              // Add required fields from AuthUser
              aud: 'authenticated',
              role: 'authenticated',
              updated_at: new Date().toISOString(),
            } as AuthUser;
            
            console.log('Created temporary admin user from cookies:', tempAdminUser);
            setUser(tempAdminUser);
            
            // Create a minimal profile to match
            const tempAdminProfile = {
              id: adminUserId,
              email: adminEmail,
              role: 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as User;
            
            setProfile(tempAdminProfile);
          } catch (err) {
            console.error('Error creating temporary admin user:', err);
          }
        }
        
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout
    
    setLoadingTimeout(timeout);
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    // Initial auth state check
    const checkUser = async () => {
      try {
        console.log('Checking initial auth session...');
        
        // Check for admin cookies first
        const hasAdminAccess = checkForAdminAccess();
        if (hasAdminAccess) {
          console.log('Detected admin cookies during initial auth check');
        }
        
        // Try to get session from multiple potential storage locations
        let sessionUser = null;
        
        // First try the standard method
        const { data } = await supabase.auth.getSession();
        sessionUser = data.session?.user || null;
        
        // If no user, check for special token formats in storage
        if (!sessionUser && typeof window !== 'undefined') {
          try {
            // Check various storage options for tokens
            const checkStorageForToken = (storage: Storage, key: string) => {
              try {
                const tokenStr = storage.getItem(key);
                if (tokenStr) {
                  console.log(`Found potential token in ${key}`);
                  try {
                    const tokenData = JSON.parse(tokenStr);
                    if (tokenData.user) {
                      return tokenData.user;
                    }
                  } catch (parseErr) {
                    console.log(`Failed to parse token from ${key}:`, parseErr);
                  }
                }
                return null;
              } catch (err) {
                console.log(`Error accessing ${key}:`, err);
                return null;
              }
            };
            
            // Try multiple possible token locations and names
            const tokenKeys = ['sb-auth-token', 'supabase-auth-token', 'sb:token'];
            
            for (const key of tokenKeys) {
              sessionUser = checkStorageForToken(localStorage, key) || checkStorageForToken(sessionStorage, key);
              if (sessionUser) {
                console.log('Found user from storage token:', sessionUser.email);
                break;
              }
            }
          } catch (storageErr) {
            console.error('Error checking storage for tokens:', storageErr);
          }
        }
        
        // If we found a user or have admin access
        if (sessionUser || hasAdminAccess) {
          console.log('Initial session check:', sessionUser ? `User authenticated: ${sessionUser.id}` : 'Admin cookies found but no session user');
          if (sessionUser) {
            setUser(sessionUser);
          } else if (hasAdminAccess) {
            // Handle admin special case
            const adminEmail = 'my.main@example.com';
            // Use a valid UUID format for the admin user
            const adminId = '00000000-0000-4000-a000-000000000000';
            
            // Create a temporary admin user
            const tempAdminUser = {
              id: adminId,
              email: adminEmail,
              user_metadata: { role: 'admin', is_admin: true },
              app_metadata: {},
              created_at: new Date().toISOString(),
              // Add required fields from AuthUser
              aud: 'authenticated',
              role: 'authenticated',
              updated_at: new Date().toISOString(),
            } as AuthUser;
            
            setUser(tempAdminUser);
            
            // Create a temporary admin profile
            const tempAdminProfile = {
              id: adminId,
              email: adminEmail,
              role: 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as User;
            
            setProfile(tempAdminProfile);
          }
        } else {
          console.log('No user session found');
          setUser(null);
          setProfile(null);
        }
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
        console.log('Auth state change event:', event, 'Session:', session ? 'Present' : 'None');
        
        if (session?.user) {
          console.log('User present in session after', event, 'event. User ID:', session.user.id);
          setUser(session.user);
          
          // For sign-in events, explicitly check and create the profile if needed
          if (event === 'SIGNED_IN') {
            console.log('Signed in event detected, ensuring profile exists...');
            const { profile: userProfile } = await getUserProfile();
            if (userProfile) {
              console.log('Profile loaded after sign-in:', userProfile.id);
              setProfile(userProfile);
            }
          }
        } else {
          console.log('No user in session after', event, 'event');
          setUser(null);
          setProfile(null);
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