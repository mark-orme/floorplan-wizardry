
import { test, expect } from '@playwright/test';
import { runAccessibilityAudit } from '@/utils/testing/accessibility';
import * as fs from 'fs';
import * as path from 'path';

const violationsFilePath = path.join(process.cwd(), 'test-results', 'a11y-violations.json');

test.describe('Application Accessibility Tests', () => {
  test.beforeAll(async () => {
    // Create directory if it doesn't exist
    const dir = path.dirname(violationsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Create/clear the violations file at the start of the test run
    fs.writeFileSync(violationsFilePath, JSON.stringify([]));
  });

  // Test the canvas application main page
  test('Canvas editor should pass accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]', { timeout: 10000 });
    
    // Run accessibility audit on the page
    const violations = await runAccessibilityAudit(page, {
      excludeSelectors: ['.fabric-canvas'] // Exclude canvas as it's handled by fabric.js
    });
    
    // Log violations for reporting
    if (violations.length > 0) {
      const existingViolations = JSON.parse(fs.readFileSync(violationsFilePath, 'utf8'));
      const updatedViolations = [
        ...existingViolations,
        {
          page: 'Canvas Editor',
          url: page.url(),
          timestamp: new Date().toISOString(),
          violations: violations,
        }
      ];
      
      fs.writeFileSync(violationsFilePath, JSON.stringify(updatedViolations, null, 2));
      
      // Check for critical violations
      const criticalViolations = violations.filter(
        v => v.impact === 'critical'
      );
      
      if (criticalViolations.length > 0) {
        console.error(`Found ${criticalViolations.length} critical accessibility violations.`);
      }
    }
    
    // Expect no violations - will show detailed errors if there are any
    expect(violations).toEqual([]);
  });
  
  // Test the layer panel accessibility
  test('Layer panel should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]', { timeout: 10000 });
    
    // Open the layers panel if it exists
    const layersButton = page.getByText('Layers', { exact: true });
    if (await layersButton.isVisible()) {
      await layersButton.click();
    }
    
    // Ensure we can Tab through the interface
    await page.keyboard.press('Tab');
    
    // Check that focus works in the UI
    const hasFocusedElement = await page.evaluate(() => 
      document.activeElement !== document.body
    );
    
    expect(hasFocusedElement).toBe(true);
  });
});
