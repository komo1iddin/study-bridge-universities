-- Function to safely create a user profile bypassing RLS
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