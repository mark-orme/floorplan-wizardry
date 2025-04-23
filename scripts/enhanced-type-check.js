
#!/usr/bin/env node

/**
 * Enhanced TypeScript type-checking script
 * Provides detailed error reports and fix suggestions
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run TypeScript compiler in noEmit mode
console.log('Running TypeScript type checking...');
const result = spawnSync('npx', ['tsc', '--noEmit'], { 
  stdio: ['inherit', 'pipe', 'pipe'],
  encoding: 'utf-8'
});

// Parse errors
const errorOutput = result.stderr || result.stdout;
const errors = errorOutput.split('\n').filter(line => 
  line.includes('.ts(') || line.includes('.tsx(')
);

// Write errors to log file
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logPath = path.join(logDir, 'typescript-errors.log');
fs.writeFileSync(logPath, errorOutput);

// Print summary
if (errors.length > 0) {
  console.error(`Found ${errors.length} TypeScript errors. Details written to ${logPath}`);
  
  // Group errors by file
  const errorsByFile = {};
  errors.forEach(error => {
    const match = error.match(/([^(]+)\((\d+),(\d+)\):/);
    if (match) {
      const [_, filePath, line, column] = match;
      if (!errorsByFile[filePath]) {
        errorsByFile[filePath] = [];
      }
      errorsByFile[filePath].push({ line: Number(line), column: Number(column), message: error });
    }
  });
  
  // Print top files with errors
  console.error('\nFiles with most errors:');
  const sortedFiles = Object.entries(errorsByFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);
  
  sortedFiles.forEach(([file, fileErrors]) => {
    console.error(`${file}: ${fileErrors.length} errors`);
  });
  
  // Common suggestions
  console.error('\nCommon solutions:');
  console.error('1. For JSX in .ts files: Rename files to .tsx');
  console.error('2. For generic arrow functions: Add comma after type param <T,> or use function syntax');
  console.error('3. For React component issues: Ensure proper typing and default props');
  
  process.exit(1);
} else {
  console.log('TypeScript type checking passed!');
}
