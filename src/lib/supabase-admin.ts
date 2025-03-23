import { createClient } from '@supabase/supabase-js';

// Perform environment validation with detailed errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('CRITICAL ERROR: Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseServiceRoleKey) {
  console.error('CRITICAL ERROR: Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

// Log that we're creating the admin client (without exposing the actual keys)
console.log('Creating Supabase admin client with URL:', supabaseUrl, 
  'Service key exists:', !!supabaseServiceRoleKey);

/**
 * Create a Supabase admin client with the service role key
 * This client bypasses RLS policies and should ONLY be used in server contexts
 * 
 * NEVER expose this client to the browser
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 

// Verify the admin client works by making a test connection
// This will be executed immediately when this module is imported
(async () => {
  try {
    const { error } = await supabaseAdmin.from('users').select('count').limit(1);
    if (error) {
      console.error('Supabase admin client test query failed:', error);
    } else {
      console.log('Supabase admin client initialized successfully');
    }
  } catch (err) {
    console.error('Error testing Supabase admin client:', err);
  }
})(); 