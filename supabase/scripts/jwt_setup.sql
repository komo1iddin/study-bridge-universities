-- Test script to verify JWT claims are properly configured and accessible
-- Run this in the SQL Editor when logged in as a user to check if your claims are set correctly

-- This will show all the claims in your JWT token
SELECT auth.jwt();

-- This will show just the 'role' claim
SELECT auth.jwt() -> 'role';

-- This query will return true if the current user has an 'admin' role in the JWT
SELECT coalesce((auth.jwt() -> 'role')::text, '""') = '"admin"';

-- This query will return true if the current user has a 'client' role in the JWT
SELECT coalesce((auth.jwt() -> 'role')::text, '""') = '"client"';

-- This query will return true if the current user has a 'manager' role in the JWT
SELECT coalesce((auth.jwt() -> 'role')::text, '""') = '"manager"';

-- This shows how to check for multiple roles in a single policy (example)
SELECT coalesce((auth.jwt() -> 'role')::text, '""') IN ('"admin"', '"manager"');

-- To see which policies apply to you, run this:
SELECT * FROM pg_policies WHERE tablename = 'users';

-- To see your actual user data, try:
SELECT * FROM users WHERE id = auth.uid(); 