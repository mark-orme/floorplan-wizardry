
#!/usr/bin/env node

/**
 * Canvas benchmark runner
 * Can be run in CI environments to detect performance regressions
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  // Start local server
  const server = require('child_process').spawn('npm', ['run', 'preview']);
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    console.log('Running canvas benchmark...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/benchmark.html');
    
    // Wait for benchmark to complete
    await page.waitForFunction('window.benchmarkComplete === true', { timeout: 60000 });
    
    // Get results
    const results = await page.evaluate(() => window.benchmarkResults);
    
    // Output results
    console.log('Benchmark results:');
    console.table(results);
    
    // Save results to file
    const resultsDir = path.join(__dirname, '../benchmark-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const date = new Date().toISOString().replace(/:/g, '-');
    const resultsFile = path.join(resultsDir, `canvas-benchmark-${date}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    
    console.log(`Results saved to ${resultsFile}`);
    
    // Check for performance regression
    if (results.score < 50) {
      console.error('⚠️ Performance below acceptable threshold!');
      process.exit(1);
    }
    
    await browser.close();
  } finally {
    // Kill the server
    server.kill();
  }
})().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
