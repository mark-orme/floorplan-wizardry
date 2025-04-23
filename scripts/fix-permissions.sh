
#!/bin/bash

# Make this script executable
chmod +x "$0"

echo "Setting execution permissions on all scripts..."

# Make all shell scripts executable
chmod +x ./scripts/*.sh

# Ensure Vite is executable in node_modules
if [ -f "./node_modules/.bin/vite" ]; then
  chmod +x ./node_modules/.bin/vite
fi

echo "Permissions fixed. You should now be able to run scripts properly."
