
import { test, expect } from '@playwright/test';
import { runAccessibilityAudit, AccessibilityViolation } from '@/utils/testing/accessibility';

test.describe('Canvas Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]');
  });

  test('canvas interface should be accessible', async ({ page }) => {
    // Test the canvas interface excluding the actual canvas element
    const violations = await runAccessibilityAudit(page, {
      excludeSelectors: ['.fabric-canvas']
    });

    // Log violations for reporting
    if (violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(violations, null, 2));
    }

    expect(violations).toEqual([]);
  });

  test('toolbar should support keyboard navigation', async ({ page }) => {
    // Test keyboard navigation through toolbar items
    await page.keyboard.press('Tab');
    const firstButton = await page.getByRole('button').first();
    await expect(firstButton).toBeFocused();

    // Test all toolbar buttons are keyboard accessible
    const buttons = await page.getByRole('button').all();
    for (const button of buttons) {
      await button.focus();
      await expect(button).toBeFocused();
      await page.keyboard.press('Tab');
    }
  });

  test('canvas controls should have proper ARIA labels', async ({ page }) => {
    const toolbarButtons = await page.getByRole('button').all();
    
    for (const button of toolbarButtons) {
      const ariaLabel = await button.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });
});
