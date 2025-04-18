
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Performance result type
interface PerformanceResults {
  tests: Array<{
    name: string;
    metrics: {
      initialRender: number;
      interactionTime: number;
      fps: number;
      layoutShift: number;
      memoryIncrease: number;
      [key: string]: number;
    };
  }>;
}

// Custom window interface for performance metrics
declare global {
  interface Window {
    _perfMetrics?: {
      frames: number;
      startTime: number;
      frameTimes: number[];
    };
  }
}

// Ensure the report directory exists
const reportDir = path.join(process.cwd(), 'playwright-report');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Results file path
const resultsFilePath = path.join(reportDir, 'performance-results.json');

test.describe('Canvas Performance Tests', () => {
  test.beforeAll(async () => {
    // Initialize results file
    const initialResults: PerformanceResults = { tests: [] };
    fs.writeFileSync(resultsFilePath, JSON.stringify(initialResults, null, 2));
  });
  
  // Test initial load performance
  test('Canvas should load efficiently', async ({ page }) => {
    // Measure page load performance
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]', { timeout: 10000 });
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const performanceEntries = performance.getEntriesByType('navigation');
      const navEntry = performanceEntries[0] as any;
      
      const paintEntries = performance.getEntriesByType('paint');
      const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      // Get layout shifts
      let layoutShiftScore = 0;
      if ('LayoutShift' in window) {
        const observer = new (window as any).PerformanceObserver((list: any) => {
          for (const entry of list.getEntries()) {
            layoutShiftScore += entry.value;
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
      }
      
      return {
        loadTime: navEntry.loadEventEnd - navEntry.startTime,
        domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
        firstPaint: fpEntry ? fpEntry.startTime : 0,
        firstContentfulPaint: fcpEntry ? fcpEntry.startTime : 0,
        layoutShift: layoutShiftScore
      };
    });
    
    // Record test results
    await recordTestResults('initial-load', {
      initialRender: metrics.firstContentfulPaint,
      interactionTime: 0, // Not applicable for load test
      fps: 60, // Assumed default
      layoutShift: metrics.layoutShift,
      memoryIncrease: 0, // Not applicable for load test
      loadTime: metrics.loadTime,
      domContentLoaded: metrics.domContentLoaded
    });
    
    // Validate metrics
    expect(metrics.loadTime).toBeLessThan(5000); // Load time under 5 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // FCP under 2 seconds
  });
  
  // Test drawing performance
  test('Drawing should have responsive performance', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]', { timeout: 10000 });
    
    // Select drawing tool
    const brushButton = page.getByTitle('Brush');
    if (await brushButton.isVisible()) {
      await brushButton.click();
    }
    
    // Record memory before
    const memoryBefore = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Measure performance during drawing
    await page.evaluate(() => {
      // Create performance tracking variables
      window._perfMetrics = {
        frames: 0,
        startTime: performance.now(),
        frameTimes: [],
      };
      
      // Track FPS
      const trackFrame = () => {
        if (window._perfMetrics) {
          window._perfMetrics.frames++;
          window._perfMetrics.frameTimes.push(performance.now());
        }
        requestAnimationFrame(trackFrame);
      };
      
      requestAnimationFrame(trackFrame);
    });
    
    // Perform drawing actions
    const canvasElement = page.locator('canvas').first();
    
    // Start at center and draw
    const canvasBounds = await canvasElement.boundingBox();
    if (canvasBounds) {
      const centerX = canvasBounds.x + canvasBounds.width / 2;
      const centerY = canvasBounds.y + canvasBounds.height / 2;
      
      // Draw a square shape
      await page.mouse.move(centerX - 100, centerY - 100);
      await page.mouse.down();
      await page.mouse.move(centerX + 100, centerY - 100, { steps: 10 });
      await page.mouse.move(centerX + 100, centerY + 100, { steps: 10 });
      await page.mouse.move(centerX - 100, centerY + 100, { steps: 10 });
      await page.mouse.move(centerX - 100, centerY - 100, { steps: 10 });
      await page.mouse.up();
    }
    
    // Wait for rendering to complete
    await page.waitForTimeout(500);
    
    // Calculate FPS and other metrics
    const performanceMetrics = await page.evaluate(() => {
      const metrics = window._perfMetrics;
      
      if (!metrics) return { fps: 0, frameTimes: [] };
      
      const endTime = performance.now();
      const elapsedSeconds = (endTime - metrics.startTime) / 1000;
      const fps = metrics.frames / elapsedSeconds;
      
      // Calculate frame time variance
      let totalFrameTime = 0;
      let slowFrames = 0;
      
      for (let i = 1; i < metrics.frameTimes.length; i++) {
        const frameTime = metrics.frameTimes[i] - metrics.frameTimes[i-1];
        totalFrameTime += frameTime;
        
        if (frameTime > 16.7) { // Frames slower than 60fps
          slowFrames++;
        }
      }
      
      const avgFrameTime = totalFrameTime / (metrics.frameTimes.length - 1) || 0;
      
      // Get memory after
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
      
      return {
        fps,
        avgFrameTime,
        slowFrames,
        memoryAfter
      };
    });
    
    // Calculate memory increase
    const memoryIncrease = performanceMetrics.memoryAfter > 0 && memoryBefore > 0
      ? ((performanceMetrics.memoryAfter - memoryBefore) / memoryBefore) * 100
      : 0;
    
    // Record test results with all required metric properties
    await recordTestResults('drawing-performance', {
      initialRender: 0, // Not applicable for this test
      interactionTime: performanceMetrics.avgFrameTime || 0,
      fps: performanceMetrics.fps || 60,
      layoutShift: 0, // Not measured for this test
      memoryIncrease,
      avgFrameTime: performanceMetrics.avgFrameTime || 0,
      slowFrames: performanceMetrics.slowFrames || 0
    });
    
    // Validate drawing performance
    expect(performanceMetrics.fps).toBeGreaterThan(30);
    expect(performanceMetrics.avgFrameTime).toBeLessThan(33); // At least 30fps
    expect(memoryIncrease).toBeLessThan(100); // Less than 100% memory increase
  });
  
  // Helper function to record test results
  async function recordTestResults(testName: string, metrics: {
    initialRender: number;
    interactionTime: number;
    fps: number;
    layoutShift: number;
    memoryIncrease: number;
    [key: string]: number;
  }) {
    try {
      // Read existing results
      const resultsJson = fs.readFileSync(resultsFilePath, 'utf8');
      const results: PerformanceResults = JSON.parse(resultsJson);
      
      // Add new test results
      results.tests.push({
        name: testName,
        metrics
      });
      
      // Write updated results
      fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
    } catch (error) {
      console.error('Error recording test results:', error);
    }
  }
});
