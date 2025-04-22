
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('should pass accessibility audit for homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the canvas to be fully initialized
    await page.waitForSelector('canvas', { state: 'attached' });
    await page.waitForTimeout(1000); // Give extra time for canvas to initialize
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.canvas-container') // Exclude canvas which axe can't analyze properly
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should pass accessibility audit for drawing toolbar', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the toolbar to be fully loaded
    await page.waitForSelector('[aria-label="Drawing Tools"]', { state: 'visible' });
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[aria-label="Drawing Tools"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should pass accessibility audit for measurement guide dialog', async ({ page }) => {
    await page.goto('/');
    
    // Open the measurement guide dialog
    await page.getByRole('button', { name: /measurement guide/i }).click();
    
    // Wait for the dialog to be visible
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
