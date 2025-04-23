
#!/bin/bash

# Make this script executable
chmod +x "$0"

# Install Vite globally and locally
echo "Installing Vite..."
npm install -g vite
npm install --save-dev vite

# Verify the installation
echo "Verifying Vite installation..."
if command -v vite &> /dev/null; then
  echo "Vite is now installed and available globally."
else
  echo "Global Vite installation verification failed."
fi

if [ -f "./node_modules/.bin/vite" ]; then
  echo "Vite is installed locally in node_modules."
else
  echo "Local Vite installation verification failed."
fi

# Make other scripts executable
chmod +x ./scripts/*.sh

echo "Done."
