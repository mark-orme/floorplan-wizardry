
#!/bin/bash

# Make this script executable
chmod +x "$0"

# Ensure vite is installed
if [ ! -f "./node_modules/.bin/vite" ]; then
  echo "Installing Vite..."
  npm install --save-dev vite@latest
fi

# Set execute permissions for Vite in node_modules
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
fi

echo "Vite is now installed and executable."

# Run Vite with the provided arguments
if [ -f "./node_modules/.bin/vite" ]; then
  ./node_modules/.bin/vite "$@"
else
  echo "Failed to install Vite. Please check npm for errors."
  exit 1
fi
