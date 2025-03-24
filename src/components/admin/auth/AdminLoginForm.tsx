'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth';
import { useLocale } from 'next-intl';
import { useToast } from '@/contexts/ToastContext';
import { redirectWithLocale } from '@/lib/session-utils';
import { createClient } from '@/lib/supabase-client';

interface AdminLoginFormProps {
  localeOverride?: string;
}

export default function AdminLoginForm({ localeOverride }: AdminLoginFormProps = {}) {
  const searchParams = useSearchParams();
  // Use the locale override if provided, otherwise use the next-intl locale
  const nextIntlLocale = useLocale();
  const locale = localeOverride || nextIntlLocale;
  console.log('[AdminLoginForm] Using locale:', { localeOverride, nextIntlLocale, finalLocale: locale });
  
  const { showToast } = useToast();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      console.log('[AdminLogin] Starting login process for admin panel...');
      console.log('[AdminLogin] Email being used:', email);
      
      // Check if this is the special admin email
      const isMainAdminEmail = email === 'my.main@example.com';
      if (isMainAdminEmail) {
        console.log('[AdminLogin] Special admin email detected');
        
        // Clear any existing auth tokens to prevent conflicts
        try {
          if (typeof window !== 'undefined') {
            // Clear local storage tokens
            localStorage.removeItem('sb-auth-token');
            localStorage.removeItem('supabase-auth-token');
            localStorage.removeItem('sb:token');
            
            // Clear session storage tokens
            sessionStorage.removeItem('sb-auth-token');
            sessionStorage.removeItem('supabase-auth-token');
            sessionStorage.removeItem('sb:token');
            
            // Clear session flags
            sessionStorage.removeItem('admin_login_redirect');
            sessionStorage.removeItem('admin_login_timestamp');
            
            console.log('[AdminLogin] Cleared existing auth tokens');
          }
        } catch (clearErr) {
          console.error('[AdminLogin] Error clearing tokens:', clearErr);
        }
        
        // Use our special API endpoint for admin login
        setDebugInfo('Using specialized admin login flow...');
        
        try {
          // First check if we're in a development environment where we can use mock auth
          const isDevelopment = process.env.NODE_ENV !== 'production';
          const isMockAuthEnabled = isDevelopment && password === 'admin123';
          
          if (isMockAuthEnabled) {
            console.log('[AdminLogin] Development environment detected with special password, using mock auth');
            
            // Simulate a successful login response
            const mockData = {
              success: true,
              message: 'Admin login successful (development mode)',
              user: {
                id: 'admin-dev-mode',
                email: email,
                role: 'admin'
              },
              debug: {
                isDebugMode: true,
                nodeEnv: 'development',
                timestamp: new Date().toISOString()
              }
            };
            
            // Show success message
            showToast('Admin login successful (dev mode)', 'success');
            setIsSuccess(true);
            setDebugInfo(`Admin access granted via development mode! Redirecting to admin panel...`);
            
            // Set up the mock session
            setupAdminSession(mockData);
            
            return;
          }
          
          // Call our API endpoint that will handle admin login specifically
          const response = await fetch('/api/auth/admin-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('[AdminLogin] Admin API login error:', errorData);
            setError(errorData.error || 'Login failed. Please check your credentials.');
            showToast(errorData.error || 'Login failed', 'error');
            setIsLoading(false);
            return;
          }
          
          const data = await response.json();
          console.log('[AdminLogin] Admin API login successful:', data);
          
          // Show success message
          showToast('Admin login successful', 'success');
          setIsSuccess(true);
          setDebugInfo(`Admin access granted via API! Redirecting to admin panel...`);
          
          // Set up the admin session with the data returned from the API
          setupAdminSession(data);
          
          return;
        } catch (apiError) {
          console.error('[AdminLogin] Error calling admin login API:', apiError);
          // Fall back to regular login if API call fails
          setDebugInfo('Admin API login failed, falling back to regular login...');
        }
      }
      
      // Show initial debug info
      setDebugInfo('Starting login process...');
      
      const { user, error } = await signIn(email, password);
      
      if (error) {
        console.error('[AdminLogin] Sign-in error:', error.message);
        setError(error.message);
        showToast(error.message, 'error');
        setIsLoading(false);
        return;
      }
      
      if (user) {
        console.log('[AdminLogin] Login successful for user:', user.id);
        console.log('[AdminLogin] Debug info - Browser location:', {
          href: window.location.href,
          origin: window.location.origin,
          pathname: window.location.pathname,
          search: window.location.search,
          host: window.location.host,
          protocol: window.location.protocol
        });
        
        // Update debug info
        setDebugInfo(`Login successful for user: ${user.id}. Checking admin rights...`);
        
        // Get the user metadata to check role
        const { data: userData } = await supabase.auth.getUser();
        console.log('[AdminLogin] User metadata:', userData?.user?.user_metadata);
        console.log('[AdminLogin] User email:', userData?.user?.email);
        
        // Additional check for the target admin email
        const isTargetAdmin = userData?.user?.email === 'my.main@example.com';
        if (isTargetAdmin) {
          console.log('[AdminLogin] Detected target admin email, granting admin access');
          
          // Explicitly update user metadata to add admin role
          try {
            const { data, error } = await supabase.auth.updateUser({
              data: { role: 'admin' }
            });
            
            if (error) {
              console.error('[AdminLogin] Error updating user role:', error);
            } else {
              console.log('[AdminLogin] Successfully updated user role metadata to admin');
            }
          } catch (updateErr) {
            console.error('[AdminLogin] Exception updating user role:', updateErr);
          }
        }
        
        // Check if user has admin/manager role
        const userRole = userData?.user?.user_metadata?.role;
        console.log('[AdminLogin] User role from metadata:', userRole);
        
        // If the user doesn't have the admin/manager role AND is not the target admin email
        if (userRole !== 'admin' && userRole !== 'manager' && !isTargetAdmin) {
          setError('You do not have permission to access the admin panel. This login is for admin users only.');
          showToast('Access denied: Requires admin privileges', 'error');
          setIsLoading(false);
          setDebugInfo(`Access denied. Your role: ${userRole || 'none'}`);
          return;
        }
        
        // Show success message
        showToast('Login successful', 'success');
        setIsSuccess(true);
        const effectiveRole = isTargetAdmin ? 'admin (via email)' : userRole;
        setDebugInfo(`Admin access granted! Role: ${effectiveRole}. Redirecting to admin panel...`);
        
        // Force a session refresh before redirect
        try {
          const refreshResult = await supabase.auth.refreshSession();
          console.log('[AdminLogin] Session refresh result:', refreshResult.data.session ? 'Session valid' : 'No session');
          
          // Try to manually store the session token for extra reliability
          if (refreshResult.data.session) {
            try {
              // Store in localStorage
              localStorage.setItem('sb-auth-token', JSON.stringify(refreshResult.data.session));
              
              // Also try to store in sessionStorage as a backup
              sessionStorage.setItem('sb-auth-token', JSON.stringify(refreshResult.data.session));
              
              console.log('[AdminLogin] Manually stored session token in storage');
            } catch (storageErr) {
              console.error('[AdminLogin] Error manually storing token:', storageErr);
            }
          }
        } catch (err) {
          console.error('[AdminLogin] Error refreshing session:', err);
        }
        
        // Check storage state
        try {
          const tokenExists = !!localStorage.getItem('sb-auth-token');
          const sessionTokenExists = !!sessionStorage.getItem('sb-auth-token');
          console.log('[AdminLogin] Storage state:', { 
            localStorage: tokenExists,
            sessionStorage: sessionTokenExists
          });
        } catch (storageErr) {
          console.error('[AdminLogin] Error checking storage:', storageErr);
        }
        
        // Do a final session check
        const { data: sessionCheck } = await supabase.auth.getSession();
        console.log('[AdminLogin] Final session check:', sessionCheck.session ? 'Valid' : 'Invalid');
        
        // Get redirect URL if available or default to admin dashboard
        const redirectParam = searchParams.get('redirect') || '/admin';
        console.log('[AdminLogin] Original redirect parameter:', redirectParam);
        
        // Validate and sanitize the redirect parameter
        let redirectTo = '';
        
        // Check if the redirect parameter is a malformed URL (like "http://admin/login")
        if (redirectParam.startsWith('http://admin') || redirectParam.startsWith('https://admin')) {
          console.log('[AdminLogin] Detected malformed redirect URL, fixing it');
          // Extract just the path and use that
          try {
            const url = new URL(redirectParam);
            redirectTo = url.pathname;
            console.log('[AdminLogin] Extracted pathname from malformed URL:', redirectTo);
          } catch (e) {
            // If URL parsing fails, default to admin dashboard
            console.error('[AdminLogin] Failed to parse malformed URL, defaulting to /admin');
            redirectTo = '/admin';
          }
        } else {
          redirectTo = redirectParam;
        }
        
        // If the redirect doesn't start with '/', add it
        if (!redirectTo.startsWith('/')) {
          redirectTo = `/${redirectTo}`;
        }
        
        // Create a full URL with the origin and locale
        const origin = window.location.origin;
        
        // Special handling for admin dashboard to ensure we get to the right place
        if (redirectTo === '/admin' || redirectTo === '/admin/') {
          console.log('[AdminLogin] Special handling for admin dashboard redirect');
          
          // Force redirect to the explicit admin dashboard URL with locale
          const fullPath = `${origin}/${locale}/admin`;
          console.log('[AdminLogin] Setting explicit admin dashboard URL:', fullPath);
          
          // For the special target admin email, add extra steps to ensure session persistence
          if (isTargetAdmin) {
            console.log('[AdminLogin] Extra session persistence steps for target admin email');
            try {
              // 1. Explicitly update user metadata with admin role again
              await supabase.auth.updateUser({
                data: { 
                  role: 'admin',
                  is_admin: true // Add additional flag for redundancy
                }
              });
              
              // 2. Force another session refresh
              const refreshResult = await supabase.auth.refreshSession();
              console.log('[AdminLogin] Extra session refresh result:', refreshResult.data.session ? 'Session valid' : 'No session');
              
              // 3. Store more metadata in session storage to help with debugging
              sessionStorage.setItem('admin_user_email', email);
              sessionStorage.setItem('admin_login_redirect', 'true');
              sessionStorage.setItem('admin_login_timestamp', Date.now().toString());
              
              // 4. Additional debugging info
              console.log('[AdminLogin] Session data after refresh:', {
                hasSession: !!refreshResult.data.session,
                userId: refreshResult.data.session?.user?.id,
                expiresAt: refreshResult.data.session?.expires_at,
                metadata: refreshResult.data.session?.user?.user_metadata
              });
              
              // 5. Try to manually force the session to persist using alternative approaches
              try {
                // Supabase is looking for 'sb-auth-token' but we're manually setting both that and alternative names
                if (refreshResult.data.session) {
                  // Direct cookie approach with multiple possible names
                  document.cookie = `sb-auth-token=${JSON.stringify(refreshResult.data.session)};path=/;max-age=${60*60*24*7}`;
                  document.cookie = `supabase-auth-token=${JSON.stringify(refreshResult.data.session)};path=/;max-age=${60*60*24*7}`;
                  
                  // Try localStorage with multiple possible names
                  localStorage.setItem('sb-auth-token', JSON.stringify(refreshResult.data.session));
                  localStorage.setItem('supabase-auth-token', JSON.stringify(refreshResult.data.session));
                  localStorage.setItem('sb:token', JSON.stringify(refreshResult.data.session));
                  
                  // Try sessionStorage with multiple possible names
                  sessionStorage.setItem('sb-auth-token', JSON.stringify(refreshResult.data.session));
                  sessionStorage.setItem('supabase-auth-token', JSON.stringify(refreshResult.data.session));
                  sessionStorage.setItem('sb:token', JSON.stringify(refreshResult.data.session));
                  
                  // Add a specific flag for our custom detection
                  localStorage.setItem('admin-auth-active', 'true');
                  sessionStorage.setItem('admin-auth-active', 'true');
                  
                  console.log('[AdminLogin] Manually set auth tokens in multiple storage locations for redundancy');
                }
              } catch (storageErr) {
                console.error('[AdminLogin] Error during manual token storage:', storageErr);
              }
              
              // 6. Use a slightly longer delay to ensure everything is processed
              setTimeout(() => {
                console.log('[AdminLogin] Executing redirect to admin dashboard via direct navigation with extra delay');
                
                // Additional check: are tokens available before redirect?
                const hasLocalStorage = !!localStorage.getItem('sb-auth-token');
                const hasSessionStorage = !!sessionStorage.getItem('sb-auth-token');
                console.log('[AdminLogin] Final storage check before redirect:', { 
                  localStorage: hasLocalStorage, 
                  sessionStorage: hasSessionStorage 
                });
                
                // Set special admin cookie for middleware detection
                document.cookie = `admin-auth-token=my.main@example.com;path=/;max-age=${60*60*24*7}`;
                document.cookie = `admin-user-email=${email};path=/;max-age=${60*60*24*7}`;
                
                window.location.replace(fullPath);
              }, 3000); // Extended delay to ensure tokens are saved
            } catch (err) {
              console.error('[AdminLogin] Error in enhanced admin session setup:', err);
              // Fall back to normal flow
              sessionStorage.setItem('admin_login_redirect', 'true');
              sessionStorage.setItem('admin_login_timestamp', Date.now().toString());
              
              setTimeout(() => {
                console.log('[AdminLogin] Executing fallback redirect to admin dashboard');
                window.location.replace(fullPath);
              }, 1500);
            }
          } else {
            // Normal flow for non-special admin users
            sessionStorage.setItem('admin_login_redirect', 'true');
            sessionStorage.setItem('admin_login_timestamp', Date.now().toString());
            
            // Redirect to admin dashboard with a delay to see debug info
            setTimeout(() => {
              console.log('[AdminLogin] Executing redirect to admin dashboard via direct navigation');
              window.location.replace(fullPath);
            }, 1500); // Slightly longer delay for better UX
          }
        } else {
          // Normal handling for other redirects
          const fullPath = `${origin}/${locale}${redirectTo}`;
          console.log('[AdminLogin] Constructed full redirect URL:', fullPath);
          
          // Redirect with a delay to see debug info
          setTimeout(() => {
            console.log('[AdminLogin] Executing redirect to:', fullPath);
            // Use location.replace for consistency
            window.location.replace(fullPath);
          }, 1500); // Match the same delay
        }
      }
    } catch (err) {
      console.error('[AdminLogin] Unexpected error during login:', err);
      setIsLoading(false);
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      setDebugInfo(`Error: ${errorMsg}`);
      showToast(errorMsg, 'error');
    }
  }, [email, password, locale, showToast, supabase.auth, searchParams]);

  // Helper function to set up admin session and redirect
  const setupAdminSession = useCallback((data: any) => {
    // Create a full URL with the origin and locale for redirect
    const origin = window.location.origin;
    const fullPath = `${origin}/${locale}/admin`;
    
    // Use a valid UUID for admin
    const adminUserId = '00000000-0000-4000-a000-000000000000';
    
    // Store critical session information in multiple places for redundancy
    try {
      // Store admin flags in both localStorage and sessionStorage
      localStorage.setItem('admin-auth-active', 'true');
      localStorage.setItem('admin-user-id', adminUserId);
      localStorage.setItem('admin-user-email', email);
      
      sessionStorage.setItem('admin-auth-active', 'true');
      sessionStorage.setItem('admin-user-id', adminUserId);
      sessionStorage.setItem('admin-user-email', email);
      
      // Set debug flags
      sessionStorage.setItem('admin_login_redirect', 'true');
      sessionStorage.setItem('admin_login_timestamp', Date.now().toString());
      
      // Set special admin cookies directly from client as well for redundancy
      document.cookie = `admin-auth-token=${email};path=/;max-age=${60*60*24*7}`;
      document.cookie = `admin-user-email=${email};path=/;max-age=${60*60*24*7}`;
      document.cookie = `admin-user-id=${adminUserId};path=/;max-age=${60*60*24*7}`;
      document.cookie = `admin-auth-timestamp=${Date.now()};path=/;max-age=${60*60*24*7}`;
      
      console.log('[AdminLogin] Successfully stored admin authentication flags in multiple locations');
    } catch (storageErr) {
      console.error('[AdminLogin] Error storing admin flags:', storageErr);
    }
    
    // Create a mock session structure to store in localStorage
    try {
      const mockSession = {
        access_token: `mock_token_${Date.now()}`,
        token_type: 'bearer',
        expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
        expires_in: 86400,
        refresh_token: `mock_refresh_${Date.now()}`,
        user: {
          id: adminUserId,
          email: email,
          user_metadata: { role: 'admin', is_admin: true },
          app_metadata: {},
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
      
      // Store this mock session in multiple locations
      const sessionJSON = JSON.stringify(mockSession);
      localStorage.setItem('sb-auth-token', sessionJSON);
      localStorage.setItem('supabase-auth-token', sessionJSON);
      sessionStorage.setItem('sb-auth-token', sessionJSON);
      sessionStorage.setItem('supabase-auth-token', sessionJSON);
      
      console.log('[AdminLogin] Created and stored mock session for admin access');
    } catch (sessionErr) {
      console.error('[AdminLogin] Error creating mock session:', sessionErr);
    }
    
    // Wait to ensure cookies and storage are set before redirecting
    setTimeout(() => {
      console.log('[AdminLogin] Executing redirect to admin dashboard after API login');
      // Final check of storage before redirect
      try {
        const hasLocalStorage = !!localStorage.getItem('admin-auth-active');
        const hasSessionStorage = !!sessionStorage.getItem('admin-auth-active');
        const adminCookieExists = document.cookie.includes('admin-auth-token');
        
        console.log('[AdminLogin] Final storage check before redirect:', { 
          localStorage: hasLocalStorage, 
          sessionStorage: hasSessionStorage,
          adminCookie: adminCookieExists
        });
      } catch (checkErr) {
        console.error('[AdminLogin] Error in final storage check:', checkErr);
      }
      
      // Do a quick ping to the admin-check API to verify cookie storage
      fetch('/api/auth/admin-check')
        .then(response => response.json())
        .then(checkData => {
          console.log('[AdminLogin] Admin check result before redirect:', checkData);
        })
        .catch(err => {
          console.error('[AdminLogin] Error checking admin status:', err);
        })
        .finally(() => {
          // Replace with reload to force clean page load with cookies
          window.location.replace(fullPath);
        });
    }, 2000);
  }, [email, locale, showToast]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          Login successful! Redirecting you to admin panel...
        </div>
      )}
      
      {debugInfo && !error && !isSuccess && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded-md text-sm">
          {debugInfo}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="admin@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your password"
        />
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : isSuccess ? 'Redirecting...' : 'Sign In to Admin Panel'}
        </button>
      </div>
    </form>
  );
} 