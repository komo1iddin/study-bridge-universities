import { supabase } from '@/lib/supabase';
import { User } from '@/types/database.types';

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string, userData: Partial<User>) {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email,
          role: userData.role || 'client',
        }
      }
    });

    if (authError) {
      return { error: { message: authError.message } as AuthError };
    }

    if (!authData.user) {
      return { error: { message: 'User creation failed' } as AuthError };
    }

    // Create user profile using our API endpoint that bypasses RLS
    try {
      const response = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          userData: {
            email,
            role: userData.role || 'client',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating profile:', errorData);
        // Continue anyway, as the auth user is created and the profile can be created later
      } else {
        const profileData = await response.json();
        console.log('Profile created successfully:', profileData.message);
      }
    } catch (profileError) {
      console.error('Error calling create-profile API:', profileError);
      // Continue anyway, as the auth user is created and the profile can be created later
    }

    return { user: authData.user };
  } catch (error) {
    return { error: { message: (error as Error).message } as AuthError };
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('Signing in user with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign-in error:', error.message);
      return { error: { message: error.message } as AuthError };
    }

    console.log('Sign-in successful. User ID:', data.user?.id);
    return { user: data.user };
  } catch (error) {
    console.error('Unexpected error during sign-in:', error);
    return { error: { message: (error as Error).message } as AuthError };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: { message: error.message } as AuthError };
    }
    
    return { success: true };
  } catch (error) {
    return { error: { message: (error as Error).message } as AuthError };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { error: { message: error.message } as AuthError };
    }
    
    return { user: data.user };
  } catch (error) {
    return { error: { message: (error as Error).message } as AuthError };
  }
}

export async function getUserProfile() {
  try {
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      return { error: userError || { message: 'No authenticated user' } as AuthError };
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      // If profile doesn't exist, try to create it
      if (error.code === 'PGRST116') { // No rows returned
        try {
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
          });
          
          if (response.ok) {
            const { profile } = await response.json();
            return { profile };
          }
        } catch (createError) {
          console.error('Error creating missing profile:', createError);
        }
      }
      
      return { error: { message: error.message } as AuthError };
    }
    
    return { profile: data as User };
  } catch (error) {
    return { error: { message: (error as Error).message } as AuthError };
  }
}

export async function updateUserProfile(profileData: Partial<User>) {
  try {
    const { user, error: userError } = await getCurrentUser();
    
    if (userError || !user) {
      return { error: userError || { message: 'No authenticated user' } as AuthError };
    }
    
    // First try to get the profile to make sure it exists
    const { profile, error: getProfileError } = await getUserProfile();
    
    // If profile doesn't exist yet or there was an error getting it, 
    // don't try to update it (getUserProfile will attempt to create it)
    if (getProfileError || !profile) {
      return { error: getProfileError || { message: 'Profile not found' } as AuthError };
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      return { error: { message: error.message } as AuthError };
    }
    
    return { profile: data as User };
  } catch (error) {
    return { error: { message: (error as Error).message } as AuthError };
  }
} 