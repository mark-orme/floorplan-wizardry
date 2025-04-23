
#!/bin/bash

# Make the script executable
chmod +x "$0"

# Check if node_modules/.bin/vite exists
if [ -f "./node_modules/.bin/vite" ]; then
  echo "Running Vite from node_modules..."
  ./node_modules/.bin/vite "$@"
else
  echo "Vite not found in node_modules. Installing..."
  npm install --save-dev vite@latest
  ./node_modules/.bin/vite "$@"
fi
