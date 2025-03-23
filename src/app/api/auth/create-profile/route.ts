import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Add a debug endpoint to check if the API is accessible and the service role key is working
export async function GET() {
  try {
    // Test the connection to Supabase with admin rights
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count(*)')
      .limit(1)
      .single();
    
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
    // Log that the API was called
    console.log('Profile creation API called');
    
    const { userId, userData } = await req.json();
    
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
    
    // Check if profile already exists
    console.log('Checking if profile exists for userId:', userId);
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')  // Changed to select all columns
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for existing profile:', checkError);
      // Special handling for recursion in RLS policy
      if (checkError.code === '42P17') {
        console.error('DETECTED RLS RECURSION ERROR in policy for users table. This needs to be fixed in Supabase.');
        console.error('Attempting to continue by using admin client which bypasses RLS...');
      }
      
      return NextResponse.json(
        { 
          error: checkError.message,
          details: {
            code: checkError.code,
            hint: checkError.hint
          }
        },
        { status: 500 }
      );
    }
    
    if (existingProfile) {
      // Profile already exists, just return it
      console.log('Profile already exists, returning:', existingProfile);
      return NextResponse.json({ 
        profile: existingProfile,
        message: 'Profile already exists'
      });
    }

    // Insert the user profile using admin privileges to bypass RLS
    console.log('Creating new profile for userId:', userId);
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: userData.email,
        role: userData.role || 'client',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      // Special handling for recursion in RLS policy
      if (error.code === '42P17') {
        console.error('DETECTED RLS RECURSION ERROR in policy for users table. This needs to be fixed in Supabase.');
        console.error('Please modify your RLS policies in the Supabase dashboard.');
      }
      
      return NextResponse.json(
        { 
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint
          }
        },
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
        error: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
} 