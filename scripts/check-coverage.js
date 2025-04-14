
/**
 * Script to enforce test coverage thresholds
 * This script reads the coverage report and fails the build if coverage is below the thresholds
 */

const fs = require('fs');
const path = require('path');

// Define the thresholds from vitest.config.ts
const THRESHOLDS = {
  lines: 70,
  functions: 70,
  branches: 60,
  statements: 70
};

// Path to the coverage summary file
const coverageSummaryPath = path.resolve(__dirname, '../coverage/coverage-summary.json');

console.log('🔍 Checking test coverage against thresholds...');

try {
  // Read the coverage summary
  if (!fs.existsSync(coverageSummaryPath)) {
    console.error('❌ Coverage summary file not found. Run tests with coverage first.');
    process.exit(1);
  }

  const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
  const totalCoverage = coverageSummary.total;

  // Check against thresholds
  const results = [];
  
  if (totalCoverage.lines.pct < THRESHOLDS.lines) {
    results.push(`Lines: ${totalCoverage.lines.pct}% (threshold: ${THRESHOLDS.lines}%)`);
  }
  
  if (totalCoverage.functions.pct < THRESHOLDS.functions) {
    results.push(`Functions: ${totalCoverage.functions.pct}% (threshold: ${THRESHOLDS.functions}%)`);
  }
  
  if (totalCoverage.branches.pct < THRESHOLDS.branches) {
    results.push(`Branches: ${totalCoverage.branches.pct}% (threshold: ${THRESHOLDS.branches}%)`);
  }
  
  if (totalCoverage.statements.pct < THRESHOLDS.statements) {
    results.push(`Statements: ${totalCoverage.statements.pct}% (threshold: ${THRESHOLDS.statements}%)`);
  }

  // Report results
  if (results.length > 0) {
    console.error('❌ Test coverage below thresholds:');
    results.forEach(result => console.error(`   ${result}`));
    process.exit(1);
  } else {
    console.log('✅ All test coverage thresholds passed!');
    console.log(`   Lines: ${totalCoverage.lines.pct}% (threshold: ${THRESHOLDS.lines}%)`);
    console.log(`   Functions: ${totalCoverage.functions.pct}% (threshold: ${THRESHOLDS.functions}%)`);
    console.log(`   Branches: ${totalCoverage.branches.pct}% (threshold: ${THRESHOLDS.branches}%)`);
    console.log(`   Statements: ${totalCoverage.statements.pct}% (threshold: ${THRESHOLDS.statements}%)`);
  }
} catch (error) {
  console.error('❌ Error checking coverage:', error.message);
  process.exit(1);
}
