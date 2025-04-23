
#!/bin/bash

# Make script executable
chmod +x "$0"

echo "Fixing build issues..."

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Ensure vite is executable
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
fi

# Fix other scripts permissions
chmod +x ./scripts/*.sh

# Run dev server
echo "Starting dev server..."
npm run dev
