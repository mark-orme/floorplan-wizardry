
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation Tests', () => {
  test('should be able to navigate drawing tools with keyboard', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first tool button
    await page.keyboard.press('Tab');
    
    // Get the active element
    const firstFocusedElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('aria-label') || '';
    });
    
    // Check that a tool button is focused
    expect(firstFocusedElement).toBeTruthy();
    
    // Press Tab again to move to next button
    await page.keyboard.press('Tab');
    
    // Get the new active element
    const secondFocusedElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('aria-label') || '';
    });
    
    // Check that a different button is focused
    expect(secondFocusedElement).toBeTruthy();
    expect(secondFocusedElement).not.toBe(firstFocusedElement);
    
    // Activate the focused button with Enter
    await page.keyboard.press('Enter');
    
    // Check that the button was activated (should have a different appearance)
    const isActiveButton = await page.evaluate(() => {
      return document.activeElement?.classList.contains('active') || 
             document.activeElement?.getAttribute('data-state') === 'active' ||
             document.activeElement?.getAttribute('aria-pressed') === 'true';
    });
    
    expect(isActiveButton).toBeTruthy();
  });
});
