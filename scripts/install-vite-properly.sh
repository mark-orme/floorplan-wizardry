
#!/bin/bash

# Make this script executable
chmod +x "$0"

echo "Installing Vite properly..."

# Remove existing vite installation to start fresh
rm -rf node_modules/.bin/vite
rm -rf node_modules/vite

# Install vite as a dev dependency
npm install --save-dev vite@latest

# Verify installation
if [ -f "./node_modules/.bin/vite" ]; then
  echo "Vite installed successfully!"
  chmod +x ./node_modules/.bin/vite
else
  echo "Failed to install Vite. Please check your npm configuration."
  exit 1
fi

# Fix all script permissions
chmod +x ./scripts/*.sh

