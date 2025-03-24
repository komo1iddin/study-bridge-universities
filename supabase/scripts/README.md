# Fixing Infinite Recursion in RLS Policies

This directory contains scripts to fix the infinite recursion issue in Row Level Security (RLS) policies for the `users` table in your Supabase database.

## The Problem

The error message `infinite recursion detected in policy for relation "users"` (code: 42P17) occurs when an RLS policy queries the same table it's protecting within its policy condition. 

In your case, the problematic policy is:

```sql
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

This creates a recursive situation because:
1. When the user tries to access the `users` table
2. The policy checks if the user is an admin by querying the `users` table
3. This query itself requires checking the policy
4. The policy again checks if the user is an admin...

And this becomes an infinite recursive loop.

## The Solution

The fix involves two key changes:

1. **Change how admin role is detected**:
   - Instead of looking up the role in the users table, use the JWT token claims
   - This avoids the recursion because we no longer need to query the users table to check permissions

2. **Create a SECURITY DEFINER function**:
   - Add a `create_user_profile` function that bypasses RLS
   - This function is marked as `SECURITY DEFINER` so it runs with the privileges of the database owner
   - This provides a safe way to create profiles without hitting RLS checks

## How to Apply the Fix

### Option 1: Run the SQL Script

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Paste the contents of `fix_rls_recursion.sql` into the editor
4. Run the script
5. Test the API endpoint at `/api/auth/create-profile` to verify it works

### Option 2: Apply Changes Manually

If you prefer to apply changes incrementally:

1. First drop the problematic policies:
   ```sql
   DROP POLICY IF EXISTS "Admin can view all users" ON users;
   ```

2. Create a new policy using JWT claims instead:
   ```sql
   CREATE POLICY "Admin can manage all users" ON users
     FOR ALL USING (
       coalesce((auth.jwt() -> 'role')::text, '""') = '"admin"'
     );
   ```

3. Create the `create_user_profile` function (copy from the script)

4. Update the related policies for documents and applications to also use JWT claims

## Ensuring JWT Claims are Set

For this solution to work, make sure that the user's role is stored in the JWT claims. 
This is typically done during sign-up:

```typescript
const { data: authData, error: authError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: 'client',  // This will be available in auth.jwt() -> 'role'
    }
  }
});
```

## Testing

After applying the fix, you can test it by:

1. Running `curl -X GET http://localhost:3000/api/auth/create-profile` to check connectivity
2. Attempting to sign up a new user and verify their profile is created
3. Logging into the application and verifying no more errors appear

## Troubleshooting

If you still encounter issues:

1. Check the browser console and server logs for detailed error messages
2. Verify that the SQL function was created successfully in your database
3. Ensure the API endpoint is updated to use the `create_user_profile` RPC function
4. Make sure your users have the appropriate JWT claims set 