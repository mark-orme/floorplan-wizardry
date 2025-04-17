
#!/usr/bin/env sh

# Ensure scripts are executable
chmod +x scripts/type-check.sh
chmod +x scripts/run-depcheck.sh
chmod +x scripts/commit-msg

# Install commitlint if not already installed
if ! npx --no commitlint --version &> /dev/null; then
  echo "Installing commitlint..."
  npm install --save-dev @commitlint/cli @commitlint/config-conventional
fi

# Initialize husky
npx husky install

# Add the commit-msg hook
cp scripts/commit-msg .husky/commit-msg
chmod +x .husky/commit-msg

echo "✅ Husky setup complete with commitlint integration"
