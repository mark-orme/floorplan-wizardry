
#!/bin/bash

# Make script executable
chmod +x "$0"

# Ensure node_modules/.bin is in PATH
export PATH="./node_modules/.bin:$PATH"

# Run Vite dev server
vite
