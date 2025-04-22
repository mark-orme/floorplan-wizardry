
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Component Accessibility Tests', () => {
  test('drawing toolbar should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[role="toolbar"]', { timeout: 5000 });
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="toolbar"]')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('measurement guide dialog should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Open the measurement guide dialog
    const measurementButton = page.getByRole('button', { name: /measurement/i });
    if (await measurementButton.isVisible()) {
      await measurementButton.click();
      await page.waitForSelector('[role="dialog"]');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[role="dialog"]')
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Test keyboard navigation in dialog
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
      expect(['button', 'a', 'input']).toContain(focusedElement);
      
      // Close the dialog with Escape
      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"]')).toBeHidden();
    }
  });
});
