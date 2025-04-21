
/**
 * Module Dependency Checker
 * Enforces module dependency rules and prevents cyclic dependencies
 * Run in CI to ensure architectural boundaries are respected
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define module boundaries and allowed dependencies
const MODULE_RULES = {
  'packages/floorplan-core': {
    allowedDependencies: [],
    description: 'Core domain logic with no external dependencies'
  },
  'packages/ui-components': {
    allowedDependencies: ['packages/floorplan-core', 'packages/hooks'],
    description: 'UI components that can depend on core and hooks'
  },
  'packages/hooks': {
    allowedDependencies: ['packages/floorplan-core'],
    description: 'Hooks that can depend on core domain'
  },
  'packages/persistence': {
    allowedDependencies: ['packages/floorplan-core'],
    description: 'Persistence layer that can depend on core domain'
  },
  'packages/plugins': {
    allowedDependencies: ['packages/floorplan-core', 'packages/hooks'],
    description: 'Plugins that can depend on core and hooks'
  }
};

// File patterns to check
const FILE_PATTERNS = [
  'src/packages/**/*.ts',
  'src/packages/**/*.tsx'
];

// Regular expressions to detect imports
const IMPORT_REGEX = /import\s+(?:{[^}]*}|\*\s+as\s+[^;]+|[^;{]*)\s+from\s+['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_REGEX = /import\(['"]([^'"]+)['"]\)/g;

/**
 * Extract imports from a file
 * @param {string} fileContent File content
 * @returns {string[]} Array of imported modules
 */
function extractImports(fileContent) {
  const imports = [];
  let match;
  
  // Extract static imports
  while ((match = IMPORT_REGEX.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  
  // Extract dynamic imports
  while ((match = DYNAMIC_IMPORT_REGEX.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

/**
 * Map import path to module
 * @param {string} importPath Import path
 * @returns {string|null} Module name or null if not a module
 */
function getModuleFromImport(importPath) {
  for (const module of Object.keys(MODULE_RULES)) {
    if (importPath.includes(module)) {
      return module;
    }
  }
  return null;
}

/**
 * Get module from file path
 * @param {string} filePath File path
 * @returns {string|null} Module name or null if not in a module
 */
function getModuleFromFile(filePath) {
  for (const module of Object.keys(MODULE_RULES)) {
    if (filePath.includes(module)) {
      return module;
    }
  }
  return null;
}

/**
 * Check module dependencies
 * @returns {boolean} True if all dependencies follow rules
 */
function checkModuleDependencies() {
  const files = FILE_PATTERNS.flatMap(pattern => glob.sync(pattern));
  let hasErrors = false;
  
  // Collect all dependencies
  const moduleDependencies = {};
  
  files.forEach(file => {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(fileContent);
    const sourceModule = getModuleFromFile(file);
    
    if (!sourceModule) {
      return; // Skip files not in a module
    }
    
    if (!moduleDependencies[sourceModule]) {
      moduleDependencies[sourceModule] = new Set();
    }
    
    imports.forEach(importPath => {
      const importModule = getModuleFromImport(importPath);
      if (importModule && importModule !== sourceModule) {
        moduleDependencies[sourceModule].add(importModule);
      }
    });
  });
  
  // Check for rule violations
  console.log('Checking module dependency rules...');
  console.log('----------------------------------');
  
  Object.keys(moduleDependencies).forEach(module => {
    const dependencies = Array.from(moduleDependencies[module]);
    const rules = MODULE_RULES[module];
    
    if (!rules) {
      console.log(`⚠️ Warning: Module ${module} not defined in rules`);
      return;
    }
    
    console.log(`Module: ${module}`);
    console.log(`- Description: ${rules.description}`);
    console.log(`- Dependencies: ${dependencies.length > 0 ? dependencies.join(', ') : 'None'}`);
    
    const illegalDependencies = dependencies.filter(dep => !rules.allowedDependencies.includes(dep));
    
    if (illegalDependencies.length > 0) {
      hasErrors = true;
      console.log(`❌ Error: Illegal dependencies: ${illegalDependencies.join(', ')}`);
      console.log(`   Allowed dependencies: ${rules.allowedDependencies.length > 0 ? rules.allowedDependencies.join(', ') : 'None'}`);
    } else {
      console.log('✅ All dependencies are allowed');
    }
    
    console.log('----------------------------------');
  });
  
  // Check for cyclic dependencies
  const cycles = findCycles(moduleDependencies);
  if (cycles.length > 0) {
    hasErrors = true;
    console.log('❌ Error: Cyclic dependencies detected:');
    cycles.forEach(cycle => {
      console.log(`   ${cycle.join(' -> ')} -> ${cycle[0]}`);
    });
    console.log('----------------------------------');
  } else {
    console.log('✅ No cyclic dependencies detected');
    console.log('----------------------------------');
  }
  
  if (hasErrors) {
    console.log('❌ Module dependency check failed');
    return false;
  } else {
    console.log('✅ Module dependency check passed');
    return true;
  }
}

/**
 * Find cyclic dependencies
 * @param {Object} dependencies Dependency graph
 * @returns {Array} Array of cycles
 */
function findCycles(dependencies) {
  const cycles = [];
  const temporaryMarks = new Set();
  const permanentMarks = new Set();
  
  function visit(node, path = []) {
    if (permanentMarks.has(node)) {
      return;
    }
    
    if (temporaryMarks.has(node)) {
      const cycleStart = path.indexOf(node);
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart));
      }
      return;
    }
    
    temporaryMarks.add(node);
    path.push(node);
    
    if (dependencies[node]) {
      for (const dependency of dependencies[node]) {
        visit(dependency, [...path]);
      }
    }
    
    temporaryMarks.delete(node);
    permanentMarks.add(node);
  }
  
  for (const node of Object.keys(dependencies)) {
    if (!permanentMarks.has(node)) {
      visit(node);
    }
  }
  
  return cycles;
}

// Run the check
const success = checkModuleDependencies();
process.exit(success ? 0 : 1);
