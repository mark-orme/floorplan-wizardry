
#!/bin/bash

# Make this script executable
chmod +x "$0"

echo "Setting execution permissions on all scripts..."

# Make all shell scripts executable
chmod +x ./scripts/*.sh

# Ensure Vite is executable in node_modules
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
else
  echo "Vite binary not found in node_modules. Run npm install first."
fi

echo "Permissions fixed. You should now be able to run the scripts."
