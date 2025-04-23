
#!/bin/bash

# Make this script executable
chmod +x "$0"

# Check if required dependencies are installed
npm list zod || npm install zod@latest
npm list input-otp || npm install input-otp@latest
npm list react-resizable-panels || npm install react-resizable-panels@latest
npm list vite || npm install vite@latest

echo "Development dependencies installed successfully."

# Make other scripts executable
chmod +x ./scripts/*.sh

echo "Setup complete. Now you can run: npm run dev"
