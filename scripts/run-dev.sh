
#!/bin/bash

# Make script executable
chmod +x "$0"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# First, run the check-and-install-vite script
./scripts/check-and-install-vite.sh

# Then, run vite
echo "Starting Vite development server..."
npm run dev
