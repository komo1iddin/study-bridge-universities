// Script to update user role to admin
const { createClient } = require('@supabase/supabase-js');

// Configuration - will be loaded from env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase admin client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Email address of the user to update
const userEmail = 'my.main@example.com';

async function updateUserToAdmin() {
  console.log(`Updating user ${userEmail} to admin role...`);
  
  try {
    // Step 1: Find the user by email to get their ID
    const { data: userData, error: userError } = await supabaseAdmin
      .auth
      .admin
      .listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError.message);
      return;
    }
    
    const user = userData.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return;
    }
    
    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    
    // Step 2: Update the user's metadata to include admin role
    const { error: updateError } = await supabaseAdmin
      .auth
      .admin
      .updateUserById(user.id, {
        user_metadata: { 
          ...user.user_metadata,
          role: 'admin' 
        }
      });
    
    if (updateError) {
      console.error('Error updating user metadata:', updateError.message);
      return;
    }
    
    console.log('User metadata updated with admin role');
    
    // Step 3: Update the profile record in the users table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .update({ role: 'admin' })
      .eq('id', user.id);
    
    if (profileError) {
      console.error('Error updating profile record:', profileError.message);
      console.log('Continuing, as user_metadata role is sufficient for auth checks');
    } else {
      console.log('Profile record updated successfully');
    }
    
    console.log(`User ${userEmail} has been updated to admin role`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the update function
updateUserToAdmin()
  .then(() => {
    console.log('Update process completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  }); 