
#!/bin/bash

# Make this script executable
chmod +x "$0"

echo "Checking for Vite installation..."

# Check if vite is installed in node_modules
if [ ! -f "./node_modules/.bin/vite" ]; then
  echo "Vite not found in node_modules. Installing vite..."
  npm install --save-dev vite@latest
  
  # Verify installation
  if [ -f "./node_modules/.bin/vite" ]; then
    echo "Vite installed successfully!"
    chmod +x ./node_modules/.bin/vite
  else
    echo "Failed to install Vite. Please try running 'npm install --save-dev vite' manually."
    exit 1
  fi
else
  echo "Vite is already installed in node_modules."
  chmod +x ./node_modules/.bin/vite
fi

echo "Setting permission for Vite binary..."
chmod +x ./node_modules/.bin/vite

echo "Vite check completed. You should now be able to run 'npm run dev' successfully."
