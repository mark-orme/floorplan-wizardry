
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Automated Accessibility Audits', () => {
  test('home page should pass WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Output detailed violation information to console
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:', JSON.stringify(accessibilityScanResults.violations, null, 2));
    }
    
    // This assertion will cause the test to fail if any violations are found
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('floor plan editor should pass accessibility audits', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]');
    
    // Configure axe to ignore the canvas element itself as it's handled by fabric.js
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.fabric-canvas') // Exclude canvas elements
      .withTags(['wcag2a', 'wcag2aa']) // Check against WCAG 2.0 standards
      .analyze();
    
    // Report critical issues
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );
    
    // Log violations for debugging
    if (criticalViolations.length > 0) {
      console.log('Critical accessibility violations found:', JSON.stringify(criticalViolations, null, 2));
    }
    
    // Test should fail if critical issues are found
    expect(criticalViolations).toEqual([]);
  });
  
  test('toolbar should be accessible to keyboard users', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[role="toolbar"]');
    
    // Test keyboard navigation through toolbar items
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || '');
    
    expect(focusedElement).toBeTruthy();
    
    // Verify toolbar elements can be activated by keyboard
    await page.keyboard.press('Enter');
    
    // Run accessibility scan specifically for the toolbar
    const toolbarAccessibility = await new AxeBuilder({ page })
      .include('[role="toolbar"]')
      .analyze();
    
    expect(toolbarAccessibility.violations).toEqual([]);
  });
  
  test('modals and dialogs should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Open a dialog/modal (adjust selector as needed)
    await page.click('button[aria-label="Settings"]');
    await page.waitForSelector('[role="dialog"]');
    
    // Run accessibility check on the dialog
    const dialogAccessibility = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .analyze();
    
    expect(dialogAccessibility.violations).toEqual([]);
    
    // Test dialog can be closed with Escape key
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).toBeHidden();
  });
});
