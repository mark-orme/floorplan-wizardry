
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Smoke Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test
    await page.goto('/');
    await injectAxe(page);
  });

  test('basic page load test', async ({ page }) => {
    // Expect a title to contain floor plan
    await expect(page).toHaveTitle(/Floor Plan/);
    
    // Check for accessibility violations
    await checkA11y(page);
  });

  test('canvas should be visible', async ({ page }) => {
    // The canvas should be visible on the page
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check canvas area for accessibility
    await checkA11y(page, {
      // We can exclude interactive canvas elements 
      // that may not be strictly accessible but are necessary
      exclude: ['.canvas-container']
    });
  });

  test('toolbar contains essential drawing tools', async ({ page }) => {
    // Check toolbar is present
    const toolbar = page.locator('.toolbar, [role="toolbar"]').first();
    await expect(toolbar).toBeVisible();
    
    // Check accessibility of toolbar
    await checkA11y(page, {
      include: ['.toolbar, [role="toolbar"]']
    });
  });
});
