#!/bin/bash

# Script to test the authentication API endpoint

# Get the port being used
PORT="3000"  # Default port
DEFAULT_PORT_MSG=$(netstat -an | grep LISTEN | grep -E ":$PORT ")

if [ -z "$DEFAULT_PORT_MSG" ]; then
  # Try to find the actual port by looking at running Next.js servers
  for PORT in 3001 3002 3003 3004 3005 3006 3007 3008 3009; do
    PORT_MSG=$(netstat -an | grep LISTEN | grep -E ":$PORT ")
    if [ ! -z "$PORT_MSG" ]; then
      echo "Found Next.js server running on port $PORT"
      break
    fi
  done
fi

# Test the API endpoint with GET request to check service role
echo "Testing API endpoint connectivity and service role..."
curl -s -X GET http://localhost:$PORT/api/auth/create-profile | jq .

# Test the API endpoint with POST request to create a test profile
echo
echo "Testing profile creation with API..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"userId":"00000000-0000-0000-0000-000000000000","userData":{"email":"test@example.com","role":"client"}}' \
  http://localhost:$PORT/api/auth/create-profile | jq .

echo
echo "Tests completed. If you see error responses, review the instructions in FIXING_RLS_RECURSION.md."
echo "Remember to apply the SQL changes in your Supabase dashboard before the API will work correctly." 