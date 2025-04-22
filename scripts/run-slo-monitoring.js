
#!/usr/bin/env node
/**
 * SLO Monitoring Script
 * Runs synthetic checks against predefined Service Level Objectives
 * Used in CI to catch performance regressions
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { DEFAULT_PERFORMANCE_BUDGETS } = require('../src/utils/performance/performanceBudgets');

// SLO thresholds
const SLO_THRESHOLDS = {
  // Rendering performance
  fps: DEFAULT_PERFORMANCE_BUDGETS.fps,
  renderTime: DEFAULT_PERFORMANCE_BUDGETS.renderTime,
  
  // Page load metrics
  firstPaint: DEFAULT_PERFORMANCE_BUDGETS.firstPaint,
  firstContentfulPaint: DEFAULT_PERFORMANCE_BUDGETS.firstContentfulPaint,
  timeToInteractive: DEFAULT_PERFORMANCE_BUDGETS.timeToInteractive,
  
  // Canvas specific
  canvasInitTime: 1000,
  objectRenderTime: 100,
  
  // Memory usage
  memoryLeakThreshold: 10, // MB increase over 1 minute of usage
};

// Test scenarios to run
const SCENARIOS = [
  { name: 'empty-canvas', url: '/empty-canvas', actions: [] },
  { 
    name: 'drawing-operations', 
    url: '/', 
    actions: [
      async (page) => {
        // Simulate drawing operations
        await page.mouse.move(100, 100);
        await page.mouse.down();
        await page.mouse.move(200, 200);
        await page.mouse.up();
        await page.waitForTimeout(500);
      }
    ]
  },
  {
    name: 'many-objects', 
    url: '/stress-test', 
    actions: [
      async (page) => {
        // Wait for stress test to complete
        await page.waitForFunction(() => {
          return window.testComplete === true;
        }, { timeout: 10000 });
      }
    ]
  }
];

async function collectMetrics(page, scenario) {
  const metrics = await page.evaluate(() => {
    // Collect performance timing metrics
    const perfEntries = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime;
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime;
    
    // Get memory info if available
    let memory = undefined;
    if (performance.memory) {
      memory = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      };
    }
    
    // Get canvas metrics if available
    let canvasMetrics = {};
    if (window.canvasPerformanceMetrics) {
      canvasMetrics = window.canvasPerformanceMetrics;
    }
    
    return {
      // Page load metrics
      loadTime: perfEntries?.duration,
      firstPaint,
      firstContentfulPaint,
      domContentLoaded: perfEntries?.domContentLoadedEventEnd - perfEntries?.domContentLoadedEventStart,
      timeToInteractive: window.TTIValue,
      
      // Canvas metrics
      ...canvasMetrics,
      
      // Memory
      memory,
      
      // Timestamp
      timestamp: Date.now()
    };
  });
  
  return {
    scenario: scenario.name,
    metrics,
    timestamp: new Date().toISOString()
  };
}

async function runScenario(browser, scenario) {
  console.log(`Running scenario: ${scenario.name}`);
  
  const page = await browser.newPage();
  
  // Inject performance observer for TTI
  await page.evaluateOnNewDocument(() => {
    window.TTIValue = 0;
    
    // Simple TTI detection based on long tasks and network idle
    const ttiObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // Last long task + 5 seconds without long tasks = TTI
      if (entries.length > 0) {
        const lastTask = entries[entries.length - 1];
        window.lastLongTaskTime = lastTask.startTime + lastTask.duration;
        
        setTimeout(() => {
          if (Date.now() - window.lastLongTaskTime > 5000 && window.TTIValue === 0) {
            window.TTIValue = window.lastLongTaskTime;
          }
        }, 5000);
      }
    });
    
    ttiObserver.observe({ entryTypes: ['longtask'] });
    
    // Expose canvas metrics globally for collection
    window.canvasPerformanceMetrics = {};
  });
  
  // Navigate to the scenario URL
  await page.goto(`http://localhost:8080${scenario.url}`, { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Run scenario actions
  for (const action of scenario.actions) {
    await action(page);
  }
  
  // Collect performance metrics
  const result = await collectMetrics(page, scenario);
  await page.close();
  
  return result;
}

async function checkSLOViolations(results) {
  let violations = [];
  
  for (const result of results) {
    const { scenario, metrics } = result;
    
    // Check each metric against thresholds
    if (metrics.fps && metrics.fps < SLO_THRESHOLDS.fps) {
      violations.push({
        scenario,
        metric: 'fps',
        value: metrics.fps,
        threshold: SLO_THRESHOLDS.fps,
        message: `FPS below threshold: ${metrics.fps} (min: ${SLO_THRESHOLDS.fps})`
      });
    }
    
    if (metrics.renderTime && metrics.renderTime > SLO_THRESHOLDS.renderTime) {
      violations.push({
        scenario,
        metric: 'renderTime',
        value: metrics.renderTime,
        threshold: SLO_THRESHOLDS.renderTime,
        message: `Render time above threshold: ${metrics.renderTime}ms (max: ${SLO_THRESHOLDS.renderTime}ms)`
      });
    }
    
    if (metrics.firstPaint && metrics.firstPaint > SLO_THRESHOLDS.firstPaint) {
      violations.push({
        scenario,
        metric: 'firstPaint',
        value: metrics.firstPaint,
        threshold: SLO_THRESHOLDS.firstPaint,
        message: `First Paint above threshold: ${metrics.firstPaint}ms (max: ${SLO_THRESHOLDS.firstPaint}ms)`
      });
    }
    
    if (metrics.firstContentfulPaint && metrics.firstContentfulPaint > SLO_THRESHOLDS.firstContentfulPaint) {
      violations.push({
        scenario,
        metric: 'firstContentfulPaint',
        value: metrics.firstContentfulPaint,
        threshold: SLO_THRESHOLDS.firstContentfulPaint,
        message: `First Contentful Paint above threshold: ${metrics.firstContentfulPaint}ms (max: ${SLO_THRESHOLDS.firstContentfulPaint}ms)`
      });
    }
    
    // Add other checks as needed
  }
  
  return violations;
}

async function main() {
  try {
    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', 'performance-results');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log('Starting SLO monitoring...');
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const results = [];
    
    // Run each scenario
    for (const scenario of SCENARIOS) {
      try {
        const result = await runScenario(browser, scenario);
        results.push(result);
      } catch (error) {
        console.error(`Error running scenario ${scenario.name}:`, error);
        results.push({
          scenario: scenario.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    await browser.close();
    
    // Save raw results
    const outputFile = path.join(outputDir, `slo-results-${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Results saved to ${outputFile}`);
    
    // Check for SLO violations
    const violations = await checkSLOViolations(results);
    
    if (violations.length > 0) {
      console.error('\n🔴 SLO VIOLATIONS DETECTED:');
      violations.forEach(v => {
        console.error(`  - [${v.scenario}] ${v.message}`);
      });
      
      // Save violations
      const violationsFile = path.join(outputDir, `slo-violations-${Date.now()}.json`);
      fs.writeFileSync(violationsFile, JSON.stringify(violations, null, 2));
      
      // Exit with error code to fail CI
      process.exit(1);
    } else {
      console.log('\n✅ All SLOs met!');
    }
    
  } catch (error) {
    console.error('Error running SLO monitoring:', error);
    process.exit(1);
  }
}

main();
