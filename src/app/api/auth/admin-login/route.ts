import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

// Special admin login API that handles the case for our target admin
export async function POST(req: NextRequest) {
  try {
    console.log('[API] Admin login request received');
    
    // Parse request body
    const body = await req.json();
    const { email, password } = body;
    
    // Verify this is the special admin email
    if (email !== 'my.main@example.com') {
      console.warn('[API] Non-special admin email attempted to use admin-login API:', email);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[API] Special admin login detected for:', email);

    // Special case handling - if we're in debug mode, we'll accept any password for the special admin
    // This is only for development and debugging - would be removed in production
    const isDebugMode = process.env.NODE_ENV !== 'production';
    let authSuccess = false;
    let userId = 'admin-user';
    
    if (isDebugMode && password === 'admin123') {
      console.log('[API] Debug mode: Allowing special admin login with debug password');
      authSuccess = true;
    } else {
      // Create a Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('[API] Admin login error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      
      if (!data.session || !data.user) {
        console.error('[API] Admin login returned no session or user');
        return NextResponse.json({ error: 'No session returned' }, { status: 500 });
      }
      
      userId = data.user.id;
      authSuccess = true;
      
      // Update the user's metadata to ensure admin role
      try {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          data.user.id,
          {
            user_metadata: {
              ...data.user.user_metadata,
              role: 'admin',
              is_admin: true
            }
          }
        );
        
        if (updateError) {
          console.error('[API] Error updating admin user metadata:', updateError);
        } else {
          console.log('[API] Successfully updated admin user metadata');
        }
      } catch (updateErr) {
        console.error('[API] Exception updating admin user metadata:', updateErr);
      }
      
      // Try to create/update profile
      try {
        const { data: profileData, error: profileError } = await supabaseAdmin.rpc('create_user_profile', {
          user_id: data.user.id,
          user_email: email,
          user_role: 'admin'
        });
        
        if (profileError) {
          console.error('[API] Error creating admin profile:', profileError);
        } else {
          console.log('[API] Admin profile created/updated successfully');
        }
      } catch (profileErr) {
        console.error('[API] Exception creating admin profile:', profileErr);
      }
    }
    
    if (!authSuccess) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    // Create a response with the session token as cookies
    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful',
      user: {
        id: userId,
        email,
        role: 'admin'
      },
      debug: {
        isDebugMode,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    });
    
    // Set special admin cookies - these are readable by client code
    response.cookies.set('admin-auth-token', email, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: false, // Allow client-side code to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    response.cookies.set('admin-user-email', email, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: false, // Allow client-side code to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    response.cookies.set('admin-user-id', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: false, // Allow client-side code to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Return authentication timestamp for debugging
    response.cookies.set('admin-auth-timestamp', Date.now().toString(), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('[API] Admin login successful, cookies set');
    return response;
  } catch (error) {
    console.error('[API] Unexpected error in admin login:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 