
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

  test('should be able to open and interact with dialogs using keyboard', async ({ page }) => {
    await page.goto('/');
    
    // Find and tab to the dialog trigger button
    const buttonSelector = 'button[aria-label*="measurement" i], button:has-text("Measurement")';
    await page.waitForSelector(buttonSelector);
    
    // Tab until we reach the button
    let currentElement = '';
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!currentElement.includes('measurement') && attempts < maxAttempts) {
      await page.keyboard.press('Tab');
      currentElement = await page.evaluate(() => {
        return (document.activeElement?.getAttribute('aria-label') || '') + 
               (document.activeElement?.textContent || '');
      });
      currentElement = currentElement.toLowerCase();
      attempts++;
    }
    
    // Activate the measurement guide button
    await page.keyboard.press('Enter');
    
    // Wait for dialog to appear
    await page.waitForSelector('[role="dialog"]');
    
    // Dialog should be focused or have a focused element inside
    const dialogHasFocus = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog === document.activeElement || 
             dialog?.contains(document.activeElement) || 
             false;
    });
    
    expect(dialogHasFocus).toBeTruthy();
    
    // Press Tab to navigate inside dialog
    await page.keyboard.press('Tab');
    
    // Press Escape to close the dialog
    await page.keyboard.press('Escape');
    
    // Dialog should be closed
    await expect(page.locator('[role="dialog"]')).toBeHidden();
  });
  
  test('should handle focus trap in modal dialogs', async ({ page }) => {
    await page.goto('/');
    
    // Open a modal (looking for something that might open a modal)
    const modalTriggerSelector = 'button:has-text("Settings"), button:has-text("Options"), button[aria-label*="settings" i]';
    
    const hasModalTrigger = await page.$(modalTriggerSelector).then(Boolean);
    if (!hasModalTrigger) {
      test.skip('No modal trigger found on this page');
      return;
    }
    
    await page.click(modalTriggerSelector);
    await page.waitForSelector('[role="dialog"]');
    
    // Tab through all focusable elements and ensure focus stays within dialog
    const initialFocusId = await page.evaluate(() => document.activeElement?.id || '');
    
    // Tab multiple times
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Focus should still be within dialog
    const focusStillInDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog?.contains(document.activeElement) || false;
    });
    
    expect(focusStillInDialog).toBeTruthy();
  });
});
