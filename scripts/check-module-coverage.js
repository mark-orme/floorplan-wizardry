
/**
 * Script to enforce test coverage thresholds by module
 * This allows for fine-grained control over coverage requirements
 */

const fs = require('fs');
const path = require('path');

// Define the thresholds by module
const MODULE_THRESHOLDS = {
  hooks: {
    lines: 75,
    functions: 75,
    branches: 65,
    statements: 75
  },
  canvas: {
    lines: 80,
    functions: 80,
    branches: 70,
    statements: 80
  },
  utils: {
    lines: 85,
    functions: 85,
    branches: 75,
    statements: 85
  },
  components: {
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70
  },
  // Default thresholds for other modules
  default: {
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70
  }
};

// Path to the coverage summary file
const coverageSummaryPath = path.resolve(__dirname, '../coverage/coverage-summary.json');

console.log('🔍 Checking module-specific test coverage against thresholds...');

try {
  // Read the coverage summary
  if (!fs.existsSync(coverageSummaryPath)) {
    console.error('❌ Coverage summary file not found. Run tests with coverage first.');
    process.exit(1);
  }

  const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
  const failedModules = [];

  // Group coverage data by module
  const moduleData = {};
  Object.keys(coverageSummary).forEach(filePath => {
    if (filePath === 'total') return;
    
    // Extract module name from file path
    const moduleName = filePath.split('/src/')[1]?.split('/')[0];
    if (!moduleName) return;
    
    if (!moduleData[moduleName]) {
      moduleData[moduleName] = [];
    }
    
    moduleData[moduleName].push({
      filePath,
      coverage: coverageSummary[filePath]
    });
  });

  // Check each module against its threshold
  Object.keys(moduleData).forEach(moduleName => {
    const files = moduleData[moduleName];
    const thresholds = MODULE_THRESHOLDS[moduleName] || MODULE_THRESHOLDS.default;
    
    // Calculate aggregated coverage for this module
    const moduleCoverage = {
      lines: { covered: 0, total: 0 },
      functions: { covered: 0, total: 0 },
      statements: { covered: 0, total: 0 },
      branches: { covered: 0, total: 0 }
    };
    
    files.forEach(file => {
      const coverage = file.coverage;
      
      if (coverage.lines) {
        moduleCoverage.lines.covered += coverage.lines.covered;
        moduleCoverage.lines.total += coverage.lines.total;
      }
      
      if (coverage.functions) {
        moduleCoverage.functions.covered += coverage.functions.covered;
        moduleCoverage.functions.total += coverage.functions.total;
      }
      
      if (coverage.statements) {
        moduleCoverage.statements.covered += coverage.statements.covered;
        moduleCoverage.statements.total += coverage.statements.total;
      }
      
      if (coverage.branches) {
        moduleCoverage.branches.covered += coverage.branches.covered;
        moduleCoverage.branches.total += coverage.branches.total;
      }
    });
    
    // Calculate percentages
    const percentages = {
      lines: moduleCoverage.lines.total > 0 
        ? (moduleCoverage.lines.covered / moduleCoverage.lines.total) * 100 
        : 0,
      functions: moduleCoverage.functions.total > 0 
        ? (moduleCoverage.functions.covered / moduleCoverage.functions.total) * 100 
        : 0,
      statements: moduleCoverage.statements.total > 0 
        ? (moduleCoverage.statements.covered / moduleCoverage.statements.total) * 100 
        : 0,
      branches: moduleCoverage.branches.total > 0 
        ? (moduleCoverage.branches.covered / moduleCoverage.branches.total) * 100 
        : 0
    };
    
    // Check against thresholds
    const moduleResults = [];
    
    if (percentages.lines < thresholds.lines) {
      moduleResults.push(`Lines: ${percentages.lines.toFixed(2)}% (threshold: ${thresholds.lines}%)`);
    }
    
    if (percentages.functions < thresholds.functions) {
      moduleResults.push(`Functions: ${percentages.functions.toFixed(2)}% (threshold: ${thresholds.functions}%)`);
    }
    
    if (percentages.branches < thresholds.branches) {
      moduleResults.push(`Branches: ${percentages.branches.toFixed(2)}% (threshold: ${thresholds.branches}%)`);
    }
    
    if (percentages.statements < thresholds.statements) {
      moduleResults.push(`Statements: ${percentages.statements.toFixed(2)}% (threshold: ${thresholds.statements}%)`);
    }
    
    if (moduleResults.length > 0) {
      failedModules.push({
        name: moduleName,
        results: moduleResults,
        percentages
      });
    } else {
      console.log(`✅ Module '${moduleName}' passed all coverage thresholds`);
      console.log(`   Lines: ${percentages.lines.toFixed(2)}% (threshold: ${thresholds.lines}%)`);
      console.log(`   Functions: ${percentages.functions.toFixed(2)}% (threshold: ${thresholds.functions}%)`);
      console.log(`   Branches: ${percentages.branches.toFixed(2)}% (threshold: ${thresholds.branches}%)`);
      console.log(`   Statements: ${percentages.statements.toFixed(2)}% (threshold: ${thresholds.statements}%)`);
    }
  });

  // Report failures
  if (failedModules.length > 0) {
    console.error('❌ The following modules have coverage below thresholds:');
    failedModules.forEach(module => {
      console.error(`\n   Module: ${module.name}`);
      module.results.forEach(result => console.error(`   ${result}`));
    });
    process.exit(1);
  } else {
    console.log('\n✅ All modules passed their coverage thresholds!');
  }
} catch (error) {
  console.error('❌ Error checking module coverage:', error.message);
  process.exit(1);
}
