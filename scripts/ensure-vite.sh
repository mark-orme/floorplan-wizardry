
#!/bin/bash

# Check if vite is installed
if ! command -v vite &> /dev/null; then
  echo "Vite is not installed. Installing..."
  npm install vite@latest
fi

# Run vite with provided arguments
vite "$@"
