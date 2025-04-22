
const { ESLint } = require("eslint");
const fs = require("fs");
const path = require("path");

(async function() {
  const eslint = new ESLint({ fix: false });
  
  try {
    // Run ESLint
    const results = await eslint.lintFiles(["src/**/*.{ts,tsx}"]);
    
    // Generate JSON report
    const jsonFormatter = await eslint.loadFormatter("json");
    const jsonReport = jsonFormatter.format(results);
    
    // Write JSON report
    fs.writeFileSync("eslint-report.json", jsonReport);
    
    // Generate and print human-readable report
    const prettyFormatter = await eslint.loadFormatter("./scripts/eslint-formatter");
    console.log(await prettyFormatter.format(results));
    
    // Calculate error count
    const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);
    
    // Exit with appropriate code
    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error("Error running ESLint:", error);
    process.exit(1);
  }
})();
