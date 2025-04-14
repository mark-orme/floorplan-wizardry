
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
  "dev:enhanced": "vite --config vite.config.enhanced.ts"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ package.json scripts updated');
