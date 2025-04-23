
#!/bin/bash

# Make script executable
chmod +x "$0"

# First, run the check-and-install-vite script
./scripts/check-and-install-vite.sh

# Then, run vite
echo "Starting Vite development server..."
./node_modules/.bin/vite "$@"
