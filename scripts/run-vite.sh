
#!/bin/bash

# Make the script executable
chmod +x "$0"

# Check if vite is installed globally
if ! command -v vite &> /dev/null; then
  echo "Vite is not found globally. Trying local installation..."
  
  # Check if node_modules/.bin/vite exists
  if [ -f "./node_modules/.bin/vite" ]; then
    echo "Running Vite from node_modules..."
    ./node_modules/.bin/vite "$@"
  else
    echo "Vite not found in node_modules. Installing..."
    npm install --save-dev vite@latest
    
    echo "Running newly installed Vite..."
    ./node_modules/.bin/vite "$@"
  fi
else
  echo "Running Vite from global installation..."
  vite "$@"
fi
