
#!/bin/bash

# Make this script executable
chmod +x "$0"

# Install required dev dependencies
npm install --save-dev vite@latest

# Install required dependencies for UI components
npm install zod@latest input-otp@latest react-resizable-panels@latest

echo "Dependencies installed successfully."
