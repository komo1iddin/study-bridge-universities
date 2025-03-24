import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Add a debug endpoint to check if the API is accessible and the service role key is working
export async function GET() {
  try {
    // Test the connection to Supabase with admin rights using a simpler query
    // that's compatible with different versions of PostgREST
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase Admin connection test failed:', error);
      return NextResponse.json({
        message: 'Supabase admin connection failed',
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint || 'No hint available',
          details: error.details || 'No details available'
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Supabase admin connection successful',
      data,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
  } catch (error) {
    console.error('Unexpected error in admin connection test:', error);
    return NextResponse.json({
      message: 'Unexpected error testing admin connection',
      error: (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Log that the API was called with a timestamp
    console.log('Profile creation API called at:', new Date().toISOString());
    
    // Check if required environment variables are set
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('CRITICAL ERROR: Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
      return NextResponse.json(
        { 
          error: 'Server configuration error: Missing service role key',
          details: 'The SUPABASE_SERVICE_ROLE_KEY environment variable is not set'
        },
        { status: 500 }
      );
    }
    
    // Parse request body, handling potential parsing errors
    let userId, userData;
    try {
      const body = await req.json();
      userId = body.userId;
      userData = body.userData;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body. JSON parsing failed.' },
        { status: 400 }
      );
    }
    
    // Log the request details (without sensitive data)
    console.log('Profile creation request:', { 
      userId,
      userEmail: userData?.email,
      userRole: userData?.role 
    });
    
    // Validate the request
    if (!userId) {
      console.warn('Profile creation failed: User ID is required');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!userData || !userData.email) {
      console.warn('Profile creation failed: User email is required');
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }
    
    // First try to check if profile already exists (does not modify data)
    console.log('Checking if profile exists for userId:', userId);
    try {
      const { data: existingProfile, error: checkError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!checkError && existingProfile) {
        // Profile already exists, just return it
        console.log('Profile already exists, returning:', existingProfile);
        return NextResponse.json({
          profile: existingProfile,
          message: 'Profile already exists'
        });
      }
      
      if (checkError && checkError.code !== '42P17') {
        // Only log non-recursion errors
        console.error('Error checking for existing profile:', checkError);
      }
    } catch (checkErr) {
      console.error('Unexpected error checking for profile:', checkErr);
      // Continue to try creating the profile using RPC
    }

    // Use RPC to safely create the profile without hitting RLS recursion
    console.log('Creating profile via RPC for userId:', userId);
    const { data, error } = await supabaseAdmin.rpc('create_user_profile', {
      user_id: userId,
      user_email: userData.email,
      user_role: userData.role || 'client'
    });
    
    if (error) {
      console.error('Error creating user profile via RPC:', error);
      return NextResponse.json(
        { 
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint || 'No hint available',
            details: error.details || 'No details available'
          },
          solution: 'Please check if the create_user_profile function exists in your database'
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      console.error('Profile creation returned no data');
      return NextResponse.json(
        { error: 'Profile creation succeeded but returned no data' },
        { status: 500 }
      );
    }
    
    console.log('Profile created successfully:', data);
    return NextResponse.json({
      profile: data,
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error('Unexpected error creating profile:', error);
    return NextResponse.json(
      { 
        error: (error as Error).message || 'Unknown server error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
} 