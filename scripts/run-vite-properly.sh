
#!/bin/bash

# Make this script executable
chmod +x "$0"

echo "Starting Vite development server..."

# Try different ways to run Vite
if [ -f "./node_modules/.bin/vite" ]; then
  echo "Running local Vite from node_modules..."
  ./node_modules/.bin/vite "$@"
elif command -v vite &> /dev/null; then
  echo "Running globally installed Vite..."
  vite "$@"
else
  echo "Vite not found. Installing it first..."
  npm install -D vite
  
  if [ -f "./node_modules/.bin/vite" ]; then
    echo "Running newly installed Vite..."
    ./node_modules/.bin/vite "$@"
  else
    echo "Failed to install or find Vite. Please install it manually with: npm install -D vite"
    exit 1
  fi
fi
