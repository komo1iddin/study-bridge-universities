'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter, usePathname } from '@/i18n/utils';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase-client';
import AdminLoopReset from '../debug/AdminLoopReset';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [debugMode, setDebugMode] = useState(false); // Disable debug mode by default
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const [isAdminViaSpecialCookie, setIsAdminViaSpecialCookie] = useState(false);
  const [adminAuthChecked, setAdminAuthChecked] = useState(false); // New state to track if auth check is complete
  const [showLoopReset, setShowLoopReset] = useState(false);

  // Loop detection mechanism
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get current timestamp
        const now = Date.now();
        
        // Get last load timestamp from storage
        const lastLoadTime = parseInt(sessionStorage.getItem('admin_last_load_time') || '0', 10);
        
        // Get page load count in last 10 seconds
        const loadCount = parseInt(sessionStorage.getItem('admin_load_count') || '0', 10);
        
        // Calculate time since last load
        const timeSinceLastLoad = now - lastLoadTime;
        
        // Check if this is a rapid reload (less than 3 seconds)
        if (lastLoadTime > 0 && timeSinceLastLoad < 3000) {
          // Increment the load count
          const newLoadCount = loadCount + 1;
          sessionStorage.setItem('admin_load_count', newLoadCount.toString());
          
          // If we've loaded more than 3 times in rapid succession, it's likely a loop
          if (newLoadCount >= 3) {
            console.warn('[AdminLayout] Detected potential refresh loop, enabling reset tool');
            localStorage.setItem('loop_detected', 'true');
            sessionStorage.setItem('loop_detected', 'true');
            setShowLoopReset(true);
          }
        } else {
          // Reset the load count if it's been more than 3 seconds
          sessionStorage.setItem('admin_load_count', '1');
        }
        
        // Update last load time
        sessionStorage.setItem('admin_last_load_time', now.toString());
      } catch (err) {
        console.error('[AdminLayout] Error in loop detection:', err);
      }
    }
  }, []);

  // Check for admin cookies on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check for admin auth in multiple locations for redundancy
        const adminCookieExists = document.cookie.includes('admin-auth-token=my.main@example.com');
        const adminEmailCookieExists = document.cookie.includes('admin-user-email=my.main@example.com');
        const hasAdminFlag = localStorage.getItem('admin-auth-active') === 'true' || 
                           sessionStorage.getItem('admin-auth-active') === 'true';
        
        // Double-check local storage for more reliable detection
        const adminEmailStorage = localStorage.getItem('admin-user-email') === 'my.main@example.com' ||
                                sessionStorage.getItem('admin-user-email') === 'my.main@example.com';
        
        const hasAdminAccess = adminCookieExists || adminEmailCookieExists || hasAdminFlag || adminEmailStorage;
        
        if (hasAdminAccess) {
          console.log('[AdminLayout] Detected admin auth credentials, granting special access');
          setIsAdminViaSpecialCookie(true);
          
          // Set cookies again for redundancy if not already present
          if (!adminCookieExists) {
            document.cookie = `admin-auth-token=my.main@example.com;path=/;max-age=${60*60*24*7}`;
          }
          
          if (!adminEmailCookieExists) {
            document.cookie = `admin-user-email=my.main@example.com;path=/;max-age=${60*60*24*7}`;
          }
          
          // Ensure localStorage has admin flags
          if (!localStorage.getItem('admin-auth-active')) {
            localStorage.setItem('admin-auth-active', 'true');
            localStorage.setItem('admin-user-email', 'my.main@example.com');
          }
          
          // Ensure sessionStorage has admin flags
          if (!sessionStorage.getItem('admin-auth-active')) {
            sessionStorage.setItem('admin-auth-active', 'true');
            sessionStorage.setItem('admin-user-email', 'my.main@example.com');
          }
        }
        
        setAdminAuthChecked(true);
      } catch (err) {
        console.error('[AdminLayout] Error checking admin cookies:', err);
        setAdminAuthChecked(true);
      }
    }
  }, []);

  // Log all info for debugging
  useEffect(() => {
    console.log('[AdminLayout] Mounted with:', { 
      pathname,
      locale,
      isLoading, 
      hasUser: !!user, 
      userEmail: user?.email,
      hasProfile: !!profile, 
      role: profile?.role,
      hasAttemptedRefresh,
      isAdminViaSpecialCookie,
      adminAuthChecked
    });
    
    // Check if we're in the middle of an admin login redirect
    if (typeof window !== 'undefined' && !hasAttemptedRefresh) {
      try {
        // Skip refresh checks on the login page to prevent loops
        const isAdminLoginPage = pathname.endsWith('/admin/login');
        if (isAdminLoginPage) {
          console.log('[AdminLayout] On admin login page, skipping redirect checks');
          return;
        }
        
        // Check if we've already handled this redirect by checking for a flag
        const hasHandledRedirect = sessionStorage.getItem('admin_redirect_handled') === 'true';
        if (hasHandledRedirect) {
          console.log('[AdminLayout] Already handled this redirect, skipping');
          return;
        }
        
        const isAdminLoginRedirect = sessionStorage.getItem('admin_login_redirect') === 'true';
        const redirectTimestamp = parseInt(sessionStorage.getItem('admin_login_timestamp') || '0', 10);
        const currentTime = Date.now();
        const isRecent = (currentTime - redirectTimestamp) < 10000; // Within 10 seconds
        
        // Only do one refresh attempt
        if (isAdminLoginRedirect && isRecent && !hasAttemptedRefresh) {
          console.log('[AdminLayout] Detected recent admin login redirect, clearing flags');
          // Clear the flags
          sessionStorage.removeItem('admin_login_redirect');
          sessionStorage.removeItem('admin_login_timestamp');
          setHasAttemptedRefresh(true);
          
          // Mark that we've handled this redirect
          sessionStorage.setItem('admin_redirect_handled', 'true');
          
          // Force refresh the page after a short delay to ensure everything is loaded
          setTimeout(() => {
            console.log('[AdminLayout] Force refreshing page to ensure fresh session state');
            window.location.reload();
          }, 500);
          
          return;
        }
      } catch (err) {
        console.error('[AdminLayout] Error checking sessionStorage:', err);
      }
    }
  }, [pathname, locale, isLoading, user, profile, hasAttemptedRefresh]);

  // Helper function to check if we should be logged in based on storage
  const checkForPotentialSession = async () => {
    if (typeof window === 'undefined') return false;
    try {
      // Check if this is the admin login page - skip checks to prevent loops
      const isAdminLoginPage = pathname.endsWith('/admin/login');
      if (isAdminLoginPage) {
        console.log('[AdminLayout] On admin login page, skipping session refresh');
        return false;
      }

      // Prevent more than one refresh attempt
      if (hasAttemptedRefresh) {
        console.log('[AdminLayout] Already attempted refresh, skipping to prevent loops');
        return false;
      }
      
      // Check if there's a flag saying we already checked for a session and shouldn't check again
      const sessionChecked = localStorage.getItem('admin_session_checked') === 'true';
      if (sessionChecked) {
        console.log('[AdminLayout] Already checked for admin session, skipping to prevent loops');
        return false;
      }
      
      // Check if there's auth data in storage but no user in the state
      const hasStorageToken = !!localStorage.getItem('sb-auth-token') || 
                            !!sessionStorage.getItem('sb-auth-token') ||
                            !!localStorage.getItem('supabase-auth-token') ||
                            !!sessionStorage.getItem('supabase-auth-token') ||
                            !!localStorage.getItem('sb:token');
      
      // Special check for admin auth without regular session
      const hasAdminAuth = isAdminViaSpecialCookie || 
                         (user?.email === 'my.main@example.com');
      
      if (hasAdminAuth && !user) {
        console.log('[AdminLayout] Special admin detected but no user in state, creating mock session');
        
        // Recreate the mock session manually to help with auth
        try {
          const mockSession = {
            access_token: `mock_token_${Date.now()}`,
            token_type: 'bearer',
            expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours
            expires_in: 86400,
            refresh_token: `mock_refresh_${Date.now()}`,
            user: {
              id: localStorage.getItem('admin-user-id') || 'admin-user',
              email: 'my.main@example.com',
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
          
          // Set flag to prevent future session checks
          localStorage.setItem('admin_session_checked', 'true');
          
          // Force page refresh to attempt to pick up the mock session
          setHasAttemptedRefresh(true);
          window.location.reload();
          return true;
        } catch (mockErr) {
          console.error('[AdminLayout] Error creating mock session:', mockErr);
        }
      }
      
      if (hasStorageToken && !user) {
        console.log('[AdminLayout] Found auth token in storage but no user in state, forcing refresh');
        setHasAttemptedRefresh(true);
        
        // Set flag to prevent future session checks
        localStorage.setItem('admin_session_checked', 'true');
        
        // Force refresh the session from Supabase
        const supabase = createClient();
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('[AdminLayout] Failed to refresh session:', error);
        } else {
          console.log('[AdminLayout] Successfully refreshed session, reloading page');
          // Add a timeout to prevent immediate reload loop
          setTimeout(() => {
            window.location.reload();
          }, 500);
          return true;
        }
      }
    } catch (err) {
      console.error('[AdminLayout] Error checking storage:', err);
    }
    return false;
  };
  
  // Check if user has admin rights
  useEffect(() => {
    // Skip checks until initial auth cookie check is complete
    if (!adminAuthChecked) {
      console.log('[AdminLayout] Skipping admin rights check until cookie check is complete');
      return;
    }
    
    console.log('[AdminLayout] Auth state updated:', { 
      isLoading, 
      hasUser: !!user, 
      userEmail: user?.email,
      hasProfile: !!profile, 
      role: profile?.role,
      isRedirecting,
      debugMode,
      pathname,
      hasAttemptedRefresh,
      isAdminViaSpecialCookie
    });
    
    // If no user but we might have a session, check storage
    if (!user && !isLoading && !hasAttemptedRefresh) {
      // Use the extracted function to check for a potential session
      checkForPotentialSession();
    }
    
    // Check if this is the admin login page - no permissions needed for it
    const isAdminLoginPage = pathname.endsWith('/admin/login');
    if (isAdminLoginPage) {
      console.log('[AdminLayout] Admin login page detected, skipping permission check');
      return;
    }

    // Only proceed with checks if the loading state is complete and we're not already redirecting
    if (!isLoading && !isRedirecting) {
      // Special check for admin access
      const isMainAdminEmail = user?.email === 'my.main@example.com';
      const hasAdminAccess = isMainAdminEmail || isAdminViaSpecialCookie;
      
      if (hasAdminAccess) {
        console.log('[AdminLayout] Special admin access granted:', isMainAdminEmail ? 'via email' : 'via cookies');
        
        // Ensure cookies are set
        if (typeof window !== 'undefined' && isMainAdminEmail) {
          document.cookie = `admin-auth-token=my.main@example.com;path=/;max-age=${60*60*24*7}`;
          document.cookie = `admin-user-email=my.main@example.com;path=/;max-age=${60*60*24*7}`;
          localStorage.setItem('admin-auth-active', 'true');
          sessionStorage.setItem('admin-auth-active', 'true');
        }
        
        return; // Skip all other checks - admin is granted full access
      }
      
      // Check if user is missing or doesn't have admin/manager role
      if (!user || !profile || (profile.role !== 'admin' && profile.role !== 'manager')) {
        console.log('[AdminLayout] User not authorized to access admin panel');
        
        if (debugMode) {
          console.log('[AdminLayout] Debug mode enabled - not redirecting');
        } else {
          console.log('[AdminLayout] Redirecting to home page...');
          setIsRedirecting(true);
          router.push('/');
        }
      } else {
        console.log('[AdminLayout] User authorized, showing admin panel');
      }
    }
  }, [user, profile, isLoading, router, isRedirecting, debugMode, locale, pathname, hasAttemptedRefresh, isAdminViaSpecialCookie, adminAuthChecked]);

  // Function to handle sidebar collapse state
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading authentication state...</p>
      </div>
    );
  }

  // Show a redirect message if we're about to redirect
  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-medium">You don't have permission to access this area.</p>
          <p className="mt-2">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  // Debug mode UI for unauthorized users
  if (debugMode && (!user || !profile || (profile.role !== 'admin' && profile.role !== 'manager'))) {
    // Skip debug UI for login page
    const isAdminLoginPage = pathname.endsWith('/admin/login');
    if (isAdminLoginPage) {
      return <>{children}</>;
    }
    
    // Special case for our target admin email or special cookie
    const isMainAdminEmail = user?.email === 'my.main@example.com';
    const hasAdminAccess = isMainAdminEmail || isAdminViaSpecialCookie;
    
    if (hasAdminAccess) {
      console.log('[AdminLayout] Target admin access detected, bypassing debug UI');
      
      // For target admin email, render the normal admin layout with extra info
      return (
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar onToggleCollapse={handleSidebarToggle} />
          
          <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mx-4 mt-4">
              <div className="flex">
                <p className="text-sm font-bold mr-2">
                  Special Admin Access Mode:
                </p>
                <p className="text-sm">
                  {isMainAdminEmail 
                    ? `Authorized via email (${user.email})`
                    : 'Authorized via admin cookies/tokens'}
                </p>
              </div>
              <div className="text-xs mt-1">
                <span className="font-semibold">User ID:</span> {user?.id || 'Not available'} | 
                <span className="font-semibold ml-2">Profile:</span> {profile ? 'Found' : 'Not found'} |
                <span className="font-semibold ml-2">Metadata Role:</span> {user?.user_metadata?.role || 'Not set'}
              </div>
            </div>
            <main className="p-0">{children}</main>
          </div>
        </div>
      );
    }
    
    // Show debug info for non-admin users
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Access Debug</h2>
          <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-60 text-sm">
            <h3 className="font-semibold mb-2">Authentication State:</h3>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
            <p><strong>Profile:</strong> {profile ? 'Loaded' : 'Not found'}</p>
            <p><strong>Role:</strong> {profile?.role || 'None'}</p>
            <p><strong>Admin Cookie:</strong> {isAdminViaSpecialCookie ? 'Present' : 'Not found'}</p>
            <p><strong>Path:</strong> {pathname}</p>
            <p><strong>Locale:</strong> {locale}</p>
          </div>
          
          <div className="mb-4">
            <a 
              href="/api/auth/debug" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              Open auth debug tool in new tab
            </a>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
            <button 
              onClick={() => setDebugMode(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is the login page - if so, render without the admin layout
  const isAdminLoginPage = pathname.endsWith('/admin/login');
  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  // Special handling for detected special admin email or cookie
  const isMainAdminEmail = user?.email === 'my.main@example.com';
  const hasAdminAccess = isMainAdminEmail || isAdminViaSpecialCookie;

  // Final render for admin users with normal dashboard
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onToggleCollapse={handleSidebarToggle} />
      
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {hasAdminAccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 mx-4 mt-4">
            <p className="text-sm">
              <strong>Admin Access:</strong> {isMainAdminEmail 
                ? `Authorized via email (${user.email})`
                : 'Authorized via special admin privileges'}
            </p>
          </div>
        )}
        
        {/* Add loop reset component if there's a potential loop */}
        {(showLoopReset || 
          localStorage.getItem('loop_detected') === 'true' || 
          sessionStorage.getItem('loop_detected') === 'true') && (
          <div className="mx-4 mt-2 mb-4">
            <AdminLoopReset />
          </div>
        )}
        
        <main className="p-0">{children}</main>
      </div>
    </div>
  );
} 