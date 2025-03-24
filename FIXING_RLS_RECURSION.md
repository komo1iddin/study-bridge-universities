# Fixing Infinite Recursion in Supabase RLS Policies

## The Problem

You're encountering the following error:
```
{"code":"42P17","details":null,"hint":null,"message":"infinite recursion detected in policy for relation \"users\""}
```

This error occurs because of a circular reference in your Row Level Security (RLS) policies. Specifically, the policy that checks if a user is an admin is querying the same table it's trying to protect, causing an infinite loop.

## Root Cause

In your migration file `supabase/migrations/20240709000001_users_and_applications.sql`, there's a problematic policy:

```sql
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

The issue is that this policy tries to determine if the current user is an admin by querying the `users` table, but this query itself triggers the same policy check, leading to infinite recursion.

## The Solution

We've created a comprehensive fix with these components:

1. **Fixed RLS Policies**: Updated policies to use JWT claims instead of querying the users table
2. **Database Function**: Created a `create_user_profile` stored procedure that safely bypasses RLS
3. **Updated API Route**: Modified the create-profile API endpoint to use the new function

## Step-by-Step Implementation

### 1. Apply the Database Changes

Log into your Supabase dashboard and run the following SQL in the SQL Editor:

```sql
-- Drop existing problematic policies on users table
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;

-- Add fixed admin policy that doesn't cause recursion
CREATE POLICY "Admin can manage all users" ON users
  FOR ALL USING (
    coalesce((auth.jwt() -> 'role')::text, '""') = '"admin"'
  );

-- Create or replace the function to safely create user profiles
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_role TEXT DEFAULT 'client'
)
RETURNS users AS $$
DECLARE
  new_profile users;
  timestamp TIMESTAMP WITH TIME ZONE := now();
BEGIN
  -- Validate inputs
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be NULL';
  END IF;
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'user_email cannot be NULL';
  END IF;
  
  -- Check if profile already exists
  SELECT * INTO new_profile FROM users WHERE id = user_id;
  
  IF FOUND THEN
    -- Profile already exists, return it
    RETURN new_profile;
  END IF;
  
  -- Insert new profile
  INSERT INTO users (
    id,
    email,
    role,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    COALESCE(user_role, 'client'),
    timestamp,
    timestamp
  )
  RETURNING * INTO new_profile;
  
  RETURN new_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also fix the document policies to prevent possible recursion
DROP POLICY IF EXISTS "Managers can view assigned application documents" ON documents;

CREATE POLICY "Managers can view assigned application documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_id AND 
      (a.assigned_manager_id = auth.uid() OR coalesce((auth.jwt() -> 'role')::text, '""') IN ('"admin"', '"manager"'))
    )
  );

-- Fix applications policies as well
DROP POLICY IF EXISTS "Managers can view assigned applications" ON applications;

CREATE POLICY "Managers can view assigned applications" ON applications
  FOR SELECT USING (
    auth.uid() = assigned_manager_id OR
    coalesce((auth.jwt() -> 'role')::text, '""') IN ('"admin"', '"manager"')
  );

-- Grant usage on the schema to authenticated users for the function
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;
```

### 2. The API Changes (Already Implemented)

The API endpoint has been updated to use the new RPC function:

```typescript
// Use RPC to safely create the profile without hitting RLS recursion
console.log('Creating profile via RPC for userId:', userId);
const { data, error } = await supabaseAdmin.rpc('create_user_profile', {
  user_id: userId,
  user_email: userData.email,
  user_role: userData.role || 'client'
});
```

### 3. Restart Your Dev Server

After applying these changes:

```bash
npm run dev
```

## Testing the Fix

1. Try registering a new user
2. Verify the user profile is created without errors
3. Check the logs for any issues

## How This Fix Works

1. **JWT-Based Role Checking**: Instead of querying the users table to check roles, we use the JWT claims stored in the auth token:
   ```sql
   coalesce((auth.jwt() -> 'role')::text, '""') = '"admin"'
   ```

2. **SECURITY DEFINER Function**: The `create_user_profile` function runs with the database owner's permissions, bypassing RLS:
   ```sql
   CREATE OR REPLACE FUNCTION create_user_profile(...) 
   RETURNS users AS $$ 
   ... 
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

3. **Direct RPC Call**: The API now calls this function directly, avoiding the problematic queries:
   ```typescript
   await supabaseAdmin.rpc('create_user_profile', {...});
   ```

## Preventing This Issue in the Future

When creating RLS policies:

1. Avoid policies that query the same table they're protecting
2. Use JWT claims for role-based access when possible
3. Create SECURITY DEFINER functions for operations that need to bypass RLS
4. Use appropriate grants to control access to these functions

Your authentication flow is now correctly setting the role in JWT claims during signup, so the fixed policies will work correctly. 