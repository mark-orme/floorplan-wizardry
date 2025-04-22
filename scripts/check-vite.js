
#!/usr/bin/env node

/**
 * Checks if vite is installed and properly linked
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if vite exists in node_modules
const viteExists = fs.existsSync(path.join(process.cwd(), 'node_modules', '.bin', 'vite'));
console.log(`Vite executable found: ${viteExists ? 'Yes' : 'No'}`);

// Try to run vite --version
const viteVersion = spawnSync('npx', ['vite', '--version'], { encoding: 'utf8' });
console.log(`Vite version check result: ${viteVersion.stdout || viteVersion.stderr || 'Unknown'}`);

// Check package.json for vite dependency
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const viteInPackage = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;
console.log(`Vite in package.json: ${viteInPackage || 'Not found'}`);

// Suggest remedies if issues are found
if (!viteExists || viteVersion.status !== 0) {
  console.log('\nTo fix vite issues, try these commands:');
  console.log('1. npm install vite@latest');
  console.log('2. npm dedupe');
  console.log('3. npm rebuild');
  console.log('4. rm -rf node_modules && npm install');
}
