
#!/bin/bash

# Make script executable
chmod +x "$0"

echo "Fixing build issues..."

# Ensure vite is executable
chmod +x ./node_modules/.bin/vite

# Fix other scripts permissions
chmod +x ./scripts/*.sh

# Run dev server
echo "Starting dev server..."
npm run dev
