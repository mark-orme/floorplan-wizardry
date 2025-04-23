
#!/bin/bash

# Make script executable
chmod +x "$0"

# Ensure correct permissions
echo "Setting up correct permissions..."
chmod +x ./scripts/*.sh
chmod +x ./node_modules/.bin/vite

# Run Vite dev server
echo "Starting Vite development server..."
./node_modules/.bin/vite "$@"
