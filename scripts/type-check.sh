
#!/usr/bin/env sh

# Run TypeScript compiler with strict settings to check for type errors
echo "🔍 Running strict type checks..."
npx tsc --project tsconfig.strict.json --noEmit

if [ $? -ne 0 ]; then
  echo "❌ Strict type checking failed. Please fix the issues and try again."
  exit 1
fi

echo "✅ Strict type checking passed."
