
import { test, expect } from '@playwright/test';

test.describe('Canvas Drawing Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should support basic drawing operations', async ({ page }) => {
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]');
    
    // Check drawing tools presence
    await expect(page.getByRole('button', { name: 'Select' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Freehand' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Line' })).toBeVisible();
    
    // Test drawing tool selection
    await page.getByRole('button', { name: 'Freehand' }).click();
    await expect(page.getByRole('button', { name: 'Freehand' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('should handle undo/redo operations', async ({ page }) => {
    await page.waitForSelector('[data-testid="floor-plan-wrapper"]');
    
    const undoButton = page.getByRole('button', { name: 'Undo' });
    await expect(undoButton).toBeDisabled();
    
    // Select drawing tool and create a shape
    await page.getByRole('button', { name: 'Rectangle' }).click();
    const canvas = page.locator('canvas').first();
    await canvas.click();
    
    // Test undo functionality
    await expect(undoButton).toBeEnabled();
    await undoButton.click();
    await expect(undoButton).toBeDisabled();
  });
});
