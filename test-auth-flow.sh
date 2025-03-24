#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Study Bridge Authentication Flow Test ====${NC}"
echo

# Find port where Next.js is running
PORT=3000
for p in {3000..3010}; do
  if curl -s "http://localhost:$p" > /dev/null; then
    PORT=$p
    break
  fi
done

echo -e "${YELLOW}Testing on port: $PORT${NC}"
echo

# Test cookie persistence
echo -e "${BLUE}Testing session cookie persistence...${NC}"
SESSION_COOKIES=$(curl -s -i "http://localhost:$PORT/api/auth/session" | grep -i "set-cookie")

if [ -n "$SESSION_COOKIES" ]; then
  echo -e "${GREEN}Cookie headers found:${NC}"
  echo "$SESSION_COOKIES" | sed 's/^/  /'
else
  echo -e "${RED}No cookies returned from session endpoint!${NC}"
fi

echo

# Test session status
echo -e "${BLUE}Testing current session...${NC}"
curl -s -X GET "http://localhost:$PORT/api/auth/session" | jq .

echo

# Print instructions
echo -e "${YELLOW}Instructions:${NC}"
echo "1. Open http://localhost:$PORT in your browser"
echo "2. Try to login and navigate to the profile page"
echo "3. Check server logs for debugging information"
echo "4. If errors persist, run this test script again to check session state"
echo

echo -e "${BLUE}==== Test Complete ====${NC}" 