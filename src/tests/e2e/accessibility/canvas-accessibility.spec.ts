
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Canvas Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should pass accessibility checks', async ({ page }) => {
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]');
    
    const results = await new AxeBuilder({ page })
      .exclude('.fabric-canvas') // Exclude canvas as it's handled by fabric.js
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
  
  test('should have proper keyboard navigation', async ({ page }) => {
    // Test toolbar keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Select' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Freehand' })).toBeFocused();
  });
});
