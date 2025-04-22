const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add our custom scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "type-check:strict": "sh scripts/type-check.sh",
  "depcheck": "sh scripts/run-depcheck.sh",
  "setup:husky": "sh scripts/setup-husky.sh",
  "build:enhanced": "vite build --config vite.config.enhanced.ts",
  "dev:enhanced": "vite --config vite.config.enhanced.ts",
  "lint": "node scripts/lint-and-log.js",
  "lint:json": "eslint --format json --output-file eslint-report.json \"src/**/*.{ts,tsx}\"",
  "lint:fix": "eslint --fix \"src/**/*.{ts,tsx}\"",
  "lint:pretty": "eslint --format ./scripts/eslint-formatter.js \"src/**/*.{ts,tsx}\"",
  "test:coverage": "vitest run --coverage && node scripts/check-coverage.js",
  "test:e2e": "playwright test",
  "analyze": "node scripts/analyze-bundle.js",
  "build:analyze": "vite build && node scripts/analyze-bundle.js"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ package.json scripts updated');
