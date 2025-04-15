
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Read the current package.json
let packageJson;
try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (err) {
  console.error('Error reading package.json:', err);
  process.exit(1);
}

// Add Storybook scripts
packageJson.scripts = packageJson.scripts || {};
packageJson.scripts.storybook = 'storybook dev -p 6006';
packageJson.scripts['build-storybook'] = 'storybook build';

// Write the updated package.json
try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('Successfully added Storybook scripts to package.json');
} catch (err) {
  console.error('Error writing to package.json:', err);
  process.exit(1);
}
