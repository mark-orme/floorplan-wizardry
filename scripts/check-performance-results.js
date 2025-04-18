
#!/usr/bin/env node
/**
 * Script to check performance test results
 * Enforces thresholds for key performance metrics
 */

const fs = require('fs');
const path = require('path');

// Define performance thresholds
const PERFORMANCE_THRESHOLDS = {
  // Times in milliseconds
  initialRender: 300,
  interactionTime: 100,
  layoutShift: 0.1,  // Cumulative Layout Shift threshold
  fps: 50,           // Minimum acceptable FPS
  memoryIncrease: 10 // Maximum memory increase percentage during tests
};

async function main() {
  try {
    // Read the performance results file
    const resultsPath = path.join(process.cwd(), 'playwright-report/performance-results.json');
    
    if (!fs.existsSync(resultsPath)) {
      console.log('Performance results file not found. Skipping performance threshold checks.');
      return;
    }
    
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    
    // Check if results are valid
    if (!results || !Array.isArray(results.tests)) {
      console.error('Invalid performance results format');
      process.exit(1);
    }
    
    // Process performance results
    let violations = [];
    
    for (const test of results.tests) {
      const { name, metrics } = test;
      
      // Check each metric against thresholds
      if (metrics.initialRender > PERFORMANCE_THRESHOLDS.initialRender) {
        violations.push({
          test: name,
          metric: 'initialRender',
          value: metrics.initialRender,
          threshold: PERFORMANCE_THRESHOLDS.initialRender
        });
      }
      
      if (metrics.interactionTime > PERFORMANCE_THRESHOLDS.interactionTime) {
        violations.push({
          test: name,
          metric: 'interactionTime',
          value: metrics.interactionTime,
          threshold: PERFORMANCE_THRESHOLDS.interactionTime
        });
      }
      
      if (metrics.layoutShift > PERFORMANCE_THRESHOLDS.layoutShift) {
        violations.push({
          test: name,
          metric: 'layoutShift',
          value: metrics.layoutShift,
          threshold: PERFORMANCE_THRESHOLDS.layoutShift
        });
      }
      
      if (metrics.fps < PERFORMANCE_THRESHOLDS.fps) {
        violations.push({
          test: name,
          metric: 'fps',
          value: metrics.fps,
          threshold: PERFORMANCE_THRESHOLDS.fps
        });
      }
      
      if (metrics.memoryIncrease > PERFORMANCE_THRESHOLDS.memoryIncrease) {
        violations.push({
          test: name,
          metric: 'memoryIncrease',
          value: metrics.memoryIncrease,
          threshold: PERFORMANCE_THRESHOLDS.memoryIncrease
        });
      }
    }
    
    // Print performance report
    console.log('\n===== Performance Report =====');
    
    for (const test of results.tests) {
      console.log(`\nTest: ${test.name}`);
      console.log('  Metric           | Value     | Threshold  | Status');
      console.log('  ------------------------------------------------');
      
      Object.entries(test.metrics).forEach(([metric, value]) => {
        if (PERFORMANCE_THRESHOLDS[metric]) {
          const threshold = PERFORMANCE_THRESHOLDS[metric];
          let status = '✅';
          
          // Check if this is a "lower is better" or "higher is better" metric
          if ((metric === 'fps' && value < threshold) || 
              (metric !== 'fps' && value > threshold)) {
            status = '⚠️';
          }
          
          console.log(`  ${metric.padEnd(16)} | ${value.toString().padStart(9)} | ${threshold.toString().padStart(10)} | ${status}`);
        }
      });
    }
    
    // Print violations
    if (violations.length > 0) {
      console.error('\n⚠️ Performance threshold violations:');
      violations.forEach(v => {
        console.error(`  - Test "${v.test}": ${v.metric} (${v.value}) exceeds threshold of ${v.threshold}`);
      });
      
      console.error('\nPerformance optimizations needed.');
      process.exit(1);
    } else {
      console.log('\n✅ All performance metrics are within thresholds!');
    }
    
  } catch (error) {
    console.error('Error checking performance results:', error);
    process.exit(1);
  }
}

main();
