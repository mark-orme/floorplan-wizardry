
#!/bin/bash

# Make this script executable (will need to be done manually the first time)
chmod +x "$0"

echo "Setting executable permissions for all shell scripts..."

# Find all .sh files in the scripts directory and make them executable
find ./scripts -name "*.sh" -type f -exec chmod +x {} \;

echo "Making Vite executable..."
chmod +x ./node_modules/.bin/vite 2>/dev/null || echo "Vite not found in node_modules"

echo "Done."
