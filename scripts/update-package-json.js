
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add new scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "mutation": "stryker run",
  "docs": "typedoc",
  "benchmark": "vite build && node scripts/run-canvas-benchmark.js",
  "lighthouse": "lhci autorun",
  "create-adr": "bash scripts/create-adr.sh",
  "test:a11y": "vitest run --config vitest.config.ts 'src/tests/accessibility'",
  "test:security": "vitest run --config vitest.config.ts 'src/tests/unit/security'"
};

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json with new scripts');
