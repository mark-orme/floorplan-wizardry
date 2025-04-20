
#!/bin/bash

echo "🔍 Checking for outdated dependencies..."
npm outdated

echo "🔒 Running security audit..."
npm audit

if [ $? -ne 0 ]; then
  echo "⚠️ Security vulnerabilities found."
  echo "   Run 'npm audit fix' to resolve fixable issues."
else
  echo "✅ No security vulnerabilities found."
fi

echo "📦 Dependencies check complete."

