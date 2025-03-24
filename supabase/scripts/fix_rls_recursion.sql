-- Script to fix the infinite recursion in RLS policies for the users table
-- Please run this script in the Supabase SQL Editor

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