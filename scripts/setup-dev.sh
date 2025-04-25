
#!/bin/bash

# Make this script executable
chmod +x "$0"

# Install required dependencies
npm install --save-dev vite@latest typescript@latest @types/node@latest
npm install --save fabric@latest react-router-dom@latest @tanstack/react-query@latest

# Make other scripts executable
chmod +x ./scripts/*.sh

# Start dev server
npm run dev
