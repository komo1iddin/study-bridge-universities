import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// Define interfaces for better type checking
interface AdminCheckResult {
  isTargetAdmin: boolean;
  message: string;
  metadataUpdated?: boolean;
  updateError?: string;
  error?: string;
}

// Helper API to debug authentication issues
export async function GET(req: NextRequest) {
  // Safe way to check for available cookies - now using req.cookies which is synchronous
  const cookieList: RequestCookie[] = [];
  req.cookies.getAll().forEach(cookie => {
    cookieList.push(cookie);
  });
  
  const availableCookies = cookieList.map(cookie => ({ 
    name: cookie.name, 
    value: cookie.name.includes('token') ? '***' : cookie.value.substring(0, 5) + '...' 
  }));
  
  // Create a Supabase client using the createServerClient with request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // This is a read-only function in this context
          console.log('Would set cookie', name);
        },
        remove(name: string, options: any) {
          // This is a read-only function in this context
          console.log('Would remove cookie', name);
        },
      },
    }
  );
  
  // Check the session to see if the user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // If there's a session, get the user
  let userData = null;
  let userProfile = null;
  let adminCheck: AdminCheckResult | null = null;
  
  if (session) {
    // Get the user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (user) {
      userData = {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      };
      
      // Check for profile
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile && !profileError) {
          userProfile = {
            id: profile.id,
            email: profile.email,
            role: profile.role,
          };
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
      
      // Check admin status with admin client
      if (user.email === 'my.main@example.com') {
        try {
          adminCheck = {
            isTargetAdmin: true,
            message: 'Target admin email detected'
          };
          
          // Check if metadata is correct
          if (!user.user_metadata?.role || user.user_metadata.role !== 'admin') {
            // Try to update it
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              user.id,
              {
                user_metadata: {
                  ...user.user_metadata,
                  role: 'admin',
                  is_admin: true
                }
              }
            );
            
            if (adminCheck) {
              adminCheck.metadataUpdated = !updateError;
              adminCheck.updateError = updateError?.message;
            }
          }
        } catch (err) {
          console.error('Error in admin check:', err);
          if (adminCheck) {
            adminCheck.error = (err as Error).message;
          }
        }
      }
    }
  }
  
  // Check for special admin cookies
  const adminAuthCookie = req.cookies.get('admin-auth-token');
  const adminUserCookie = req.cookies.get('admin-user-email');
  
  const adminCookies = {
    adminAuthToken: adminAuthCookie?.value,
    adminUserEmail: adminUserCookie?.value,
  };
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    cookies: {
      count: availableCookies.length,
      available: availableCookies,
    },
    session: session ? {
      expiresAt: session.expires_at,
      tokenType: session.token_type,
    } : null,
    user: userData,
    profile: userProfile,
    adminCheck,
    adminCookies,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  });
} 