
#!/usr/bin/env node

/**
 * Module Dependency Checker
 * 
 * This script verifies that imports follow the approved module dependency graph.
 * It prevents cyclic dependencies and enforces architectural boundaries.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define allowed dependencies between packages
const allowedDependencies = {
  'packages/floorplan-core': ['utils', 'types/core'],
  'packages/persistence': ['packages/floorplan-core', 'utils', 'types/core', 'types'],
  'packages/hooks': ['packages/floorplan-core', 'packages/persistence', 'utils', 'types', 'components'],
  'packages/ui-components': ['packages/hooks', 'packages/floorplan-core', 'utils', 'types', 'components'],
  'packages/plugin-api': ['packages/floorplan-core', 'utils', 'types']
};

// Define specific banned dependencies (cyclic)
const bannedDependencies = {
  'packages/floorplan-core': ['packages/ui-components', 'packages/hooks', 'packages/persistence', 'packages/plugin-api'],
  'packages/persistence': ['packages/ui-components', 'packages/hooks', 'packages/plugin-api'],
  'packages/plugin-api': ['packages/ui-components', 'packages/hooks', 'packages/persistence']
};

// Track errors
const errors = [];

// Process all TypeScript files
glob.sync('src/**/*.{ts,tsx}', { ignore: ['**/*.d.ts', '**/node_modules/**'] }).forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const packagePath = getPackagePath(file);
  
  if (!packagePath) return; // Not in a package
  
  // Extract imports
  const importLines = content.match(/import\s+.*from\s+['"]([^'"]+)['"]/g) || [];
  
  importLines.forEach(importLine => {
    const match = importLine.match(/from\s+['"]([^'"]+)['"]/);
    if (!match) return;
    
    const importPath = match[1];
    
    // Skip relative imports within the same package and node modules
    if (importPath.startsWith('.') || !importPath.startsWith('@/')) return;
    
    // Convert @/ imports to our standard format
    const normalizedImport = importPath.replace('@/', '');
    
    // Check if import is allowed
    if (!isImportAllowed(packagePath, normalizedImport)) {
      errors.push(`DEPENDENCY ERROR in ${file}:\n  ${importLine.trim()}\n  ${packagePath} is not allowed to import from ${normalizedImport}\n`);
    }
  });
});

// Output results
if (errors.length > 0) {
  console.error('Module dependency violations found:');
  errors.forEach(err => console.error(err));
  console.error(`Found ${errors.length} dependency violations`);
  process.exit(1);
} else {
  console.log('Module dependency check passed ✓');
}

/**
 * Get the package path for a file
 */
function getPackagePath(filePath) {
  const packageMatch = filePath.match(/src\/(packages\/[^/]+)/);
  return packageMatch ? packageMatch[1] : null;
}

/**
 * Check if an import is allowed for a given package
 */
function isImportAllowed(packagePath, importPath) {
  // If we don't have rules for this package, allow the import
  if (!allowedDependencies[packagePath]) return true;
  
  // Check for explicitly banned dependencies
  if (bannedDependencies[packagePath]) {
    for (const banned of bannedDependencies[packagePath]) {
      if (importPath.startsWith(banned)) {
        return false;
      }
    }
  }
  
  // Check against allowed dependencies
  for (const allowed of allowedDependencies[packagePath]) {
    if (importPath.startsWith(allowed)) {
      return true;
    }
  }
  
  return false;
}
