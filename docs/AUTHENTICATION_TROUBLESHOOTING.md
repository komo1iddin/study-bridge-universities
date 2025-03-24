# Authentication Troubleshooting Guide

This document provides guidance for troubleshooting authentication issues in the Study Bridge application.

## Common Issues and Solutions

### 1. Redirect Loop to Login Page

**Symptom:** After logging in, you are immediately redirected back to the login page.

**Potential causes and solutions:**

- **Session cookies not being set properly:**
  - Check if cookies are being blocked by browser settings
  - Verify that the domain and path in cookie settings match your application
  - Ensure cookies have appropriate SameSite and Secure attributes

- **Server not recognizing the session:**
  - Check server logs for session verification messages
  - Verify that middleware is correctly reading cookies
  - Check if the auth token format matches what the server expects

- **Missing role or permission issues:**
  - Verify user has proper role information in the database
  - Check if row-level security (RLS) policies are configured correctly

### 2. "User not found" or Missing Profile

**Symptom:** You can log in, but receive a "User not found" error or missing profile data.

**Potential causes and solutions:**

- **Profile not created during signup:**
  - Check the `create-profile` API route functionality
  - Verify database permissions for profile creation
  - Manually create a profile for the user using SQL

- **Database RLS policies blocking access:**
  - Verify RLS policies allow users to read their own profile
  - Use service role for administrative functions
  - Check for recursive RLS policy issues

### 3. Session Not Persisting After Page Refresh

**Symptom:** You log in successfully but session is lost after refreshing the page.

**Potential causes and solutions:**

- **Client-side storage issues:**
  - Check if browser has localStorage and cookies enabled
  - Verify session token is properly stored in cookies
  - Check if the token's expiration is set correctly

- **CORS or header issues:**
  - Ensure CORS settings allow cookies
  - Verify `credentials: 'include'` is set for fetch requests
  - Check for missing headers in authentication requests

## Debugging Tools and Techniques

### 1. Session Check API

Test the authentication state with:

```bash
curl -i http://localhost:3000/api/auth/session
```

This will return current session information and the cookies being set.

### 2. Authentication Flow Test Script

Run the test script to check for session persistence:

```bash
./test-auth-flow.sh
```

This script:
- Checks if the server is running
- Tests session cookie persistence
- Gets current session information
- Provides debugging instructions

### 3. Browser Developer Tools

Use browser dev tools to:

- **Application tab:** Inspect cookies, localStorage, and sessionStorage
- **Network tab:** Check auth requests/responses and cookie headers
- **Console:** View authentication-related logs

### 4. Server Logs

Run the server with debugging enabled:

```bash
DEBUG=* npm run dev
```

This will show detailed cookie and session handling, including:
- Available cookies for each request
- Session verification steps
- Cookie manipulation operations

## Architecture Overview

The authentication flow in this application uses:

1. **Client Components:**
   - `createClient()` from `@supabase/ssr` for consistent client-side auth
   - Session verification before protected operations
   - Redirect handling with hash navigation for session preservation

2. **Server Components:**
   - `createServerSupabaseClient()` for server-side auth with detailed logging
   - Async cookie handling with proper error management
   - Session verification before rendering protected pages

3. **Middleware:**
   - Route protection based on session status
   - Cookie passthrough for maintaining auth state
   - Detailed logging for debugging request handling

## Manual Session Testing

To manually test session handling:

1. Log in to the application
2. Open browser developer tools
3. Check cookies for `sb-` prefixed cookies
4. Check localStorage for Supabase session information
5. Try accessing a protected route directly by URL
6. Monitor server logs during these operations 