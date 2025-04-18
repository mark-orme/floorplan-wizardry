
import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  test('home page should pass accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Write violations to file for CI reporting
    await page.evaluate((violations) => {
      window.localStorage.setItem('a11y-violations', JSON.stringify(violations));
    }, accessibilityScanResults.violations);
    
    // Format and display violations in test report
    if (accessibilityScanResults.violations.length > 0) {
      const formattedViolations = accessibilityScanResults.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          html: node.html,
          failureSummary: node.failureSummary
        }))
      }));
      
      console.log('Accessibility violations found:', JSON.stringify(formattedViolations, null, 2));
    }
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('canvas page should pass focused accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]', { timeout: 10000 });
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.fabric-canvas') // Exclude canvas as it's handled by fabric.js
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // Check for critical violations only
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    expect(criticalViolations).toEqual([]);
  });
});
