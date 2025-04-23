
#!/bin/bash

# Make this script executable
chmod +x "$0"

echo "Fixing permissions on Vite executable..."

# Check if node_modules/.bin/vite exists
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
  echo "Vite permissions fixed."
else
  echo "Vite executable not found. Installing Vite..."
  npm install vite
  
  if [ -f "./node_modules/.bin/vite" ]; then
    chmod +x ./node_modules/.bin/vite
    echo "Vite installed and permissions fixed."
  else
    echo "Failed to install Vite. Please check your npm configuration."
  fi
fi

# Make other scripts executable
echo "Fixing permissions on all scripts..."
find ./scripts -type f -name "*.sh" -exec chmod +x {} \;

echo "All permissions fixed."

# Try running vite
echo "Testing vite command..."
./node_modules/.bin/vite --version
