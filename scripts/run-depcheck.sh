
#!/usr/bin/env sh

echo "🔍 Running depcheck to find unused dependencies..."
npx depcheck

if [ $? -ne 0 ]; then
  echo "ℹ️ depcheck found potential unused dependencies."
  echo "   Review the output and consider removing unnecessary packages."
else
  echo "✅ No unused dependencies found."
fi
