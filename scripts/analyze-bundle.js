
#!/usr/bin/env node
/**
 * Script to analyze bundle size and generate reports
 * Run with: node scripts/analyze-bundle.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { formatSize, createBundleReport } = require('../src/utils/buildReporter');

// Ensure the stats directory exists
const statsDir = path.join(process.cwd(), 'stats');
if (!fs.existsSync(statsDir)) {
  fs.mkdirSync(statsDir);
}

console.log('🔍 Building with bundle analysis...');

try {
  // Build with the rollup visualizer plugin
  execSync('npm run build', { stdio: 'inherit' });
  
  // Read the stats file
  const statsHtmlPath = path.join(process.cwd(), 'dist/stats.html');
  if (!fs.existsSync(statsHtmlPath)) {
    console.error('❌ Stats file not found. Make sure your build includes the visualizer plugin.');
    process.exit(1);
  }
  
  // Parse bundle stats from the HTML file
  const statsHtml = fs.readFileSync(statsHtmlPath, 'utf8');
  const dataMatch = statsHtml.match(/window\.__DATA__\s*=\s*(\{.+\})/s);
  
  if (!dataMatch) {
    console.error('❌ Could not extract bundle stats from the HTML file.');
    process.exit(1);
  }
  
  // Parse and process the stats
  const stats = JSON.parse(dataMatch[1]);
  
  // Calculate total size
  let totalSize = 0;
  let totalGzipSize = 0;
  
  const chunks = {};
  
  // Process all chunks
  stats.children.forEach(child => {
    const name = child.name;
    const size = child.size || 0;
    const gzipSize = child.gzipSize || 0;
    
    totalSize += size;
    totalGzipSize += gzipSize;
    
    chunks[name] = {
      size,
      gzipSize,
      formattedSize: formatSize(size),
      formattedGzipSize: formatSize(gzipSize)
    };
  });
  
  // Create a bundle stats object
  const bundleStats = {
    totalSize,
    totalGzipSize,
    formattedSize: formatSize(totalSize),
    formattedGzipSize: formatSize(totalGzipSize),
    chunks,
    timestamp: new Date().toISOString()
  };
  
  // Save the stats
  const statsJsonPath = path.join(statsDir, `bundle-stats-${Date.now()}.json`);
  fs.writeFileSync(statsJsonPath, JSON.stringify(bundleStats, null, 2));
  
  // Generate a markdown report
  const reportPath = path.join(statsDir, `bundle-report-${Date.now()}.md`);
  const report = createBundleReport({
    bundleSize: totalSize,
    jsBundleSize: totalSize, // This is an approximation
    cssBundleSize: 0, // We'd need to calculate this separately
    assets: stats.children.map(child => ({
      name: child.name,
      size: child.size,
      gzipSize: child.gzipSize,
      type: 'js' // Assuming all chunks are JS
    }))
  });
  
  fs.writeFileSync(reportPath, report);
  
  console.log(`✅ Bundle analysis complete!`);
  console.log(`📊 Total bundle size: ${formatSize(totalSize)} (${formatSize(totalGzipSize)} gzipped)`);
  console.log(`📝 Report saved to: ${reportPath}`);
  console.log(`📊 Stats saved to: ${statsJsonPath}`);
  
  // Log chunks by size
  console.log('\n📦 Chunks by size (gzipped):');
  Object.entries(chunks)
    .sort((a, b) => b[1].gzipSize - a[1].gzipSize)
    .forEach(([name, data], index) => {
      console.log(`${index + 1}. ${name}: ${data.formattedGzipSize}`);
    });
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error);
  process.exit(1);
}
