
import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';

test.describe('Canvas Accessibility', () => {
  test('should pass accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"][data-canvas-ready="true"]');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.fabric-canvas') // Exclude canvas element as it's handled by fabric.js
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should have proper keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through toolbar buttons
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Select' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Freehand' })).toBeFocused();
    
    // Test keyboard activation of tools
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: 'Freehand' })).toHaveAttribute('aria-pressed', 'true');
  });
});
