#!/bin/bash

# Set environment variables from .env.local if it exists
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local"
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Warning: .env.local file not found"
fi

# Run the Node.js script
echo "Running update script to make 'my.main@example.com' an admin user"
node update-admin-role.js

# Check exit status
if [ $? -eq 0 ]; then
  echo "✅ User role update completed"
  echo "You can now restart your application and try accessing the admin section again"
else
  echo "❌ User role update failed"
  echo "Check the error messages above for details"
fi 