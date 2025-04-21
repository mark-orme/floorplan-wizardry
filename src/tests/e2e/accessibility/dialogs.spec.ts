import { test, expect } from '@playwright/test';
import { runAccessibilityAudit } from '@/utils/testing/accessibility';

test.describe('Dialog Accessibility', () => {
  test('measurement guide dialog should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Open measurement guide dialog
    await page.getByRole('button', { name: /measurement/i }).click();
    await page.waitForSelector('[role="dialog"]');
    
    const violations = await runAccessibilityAudit(page, {
      includeSelectors: ['[role="dialog"]']
    });
    
    expect(violations).toEqual([]);
    
    // Test dialog can be closed with Escape key
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).toBeHidden();
  });

  test('dialogs should trap focus correctly', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /measurement/i }).click();
    
    // Get all focusable elements in dialog
    const focusableElements = await page.locator(
      '[role="dialog"] button, [role="dialog"] input, [role="dialog"] a'
    ).all();
    
    // Press Tab multiple times and verify focus stays within dialog
    for (let i = 0; i < focusableElements.length + 2; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => {
        const focused = document.activeElement;
        return focused ? focused.getAttribute('data-testid') : null;
      });
      
      expect(focusedElement).toBeTruthy();
      const elementIsInDialog = await page.locator(`[role="dialog"] [data-testid="${focusedElement}"]`).count() > 0;
      expect(elementIsInDialog).toBeTruthy();
    }
  });
});

export function checkDialogAccessibility(element: HTMLElement) {
  console.log("Checking dialog accessibility for:", element);
}
