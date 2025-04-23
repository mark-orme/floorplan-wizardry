
#!/bin/bash

# Check for essential development dependencies
echo "Checking for essential development dependencies..."

# Check for Vite
if ! command -v ./node_modules/.bin/vite &> /dev/null; then
  echo "Vite not found in node_modules. Installing..."
  npm install vite@latest
else
  echo "Vite is installed."
fi

# Add checks for other dependencies if needed
echo "All development dependencies are ready."

# Make other scripts executable
chmod +x ./scripts/*.sh
