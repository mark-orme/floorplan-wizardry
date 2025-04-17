
import { test, expect } from '@playwright/test';

test.describe('Canvas Drawing Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load canvas and support basic drawing operations', async ({ page }) => {
    // Wait for canvas to be ready
    await page.waitForSelector('[data-testid="floor-plan-wrapper"][data-canvas-ready="true"]');
    
    // Check drawing tools are present
    await expect(page.getByRole('button', { name: 'Select' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Freehand' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Line' })).toBeVisible();
    
    // Test drawing tool selection
    await page.getByRole('button', { name: 'Freehand' }).click();
    await expect(page.getByRole('button', { name: 'Freehand' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('should support undo/redo operations', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"][data-canvas-ready="true"]');
    
    // Click undo button (should be disabled initially)
    const undoButton = page.getByRole('button', { name: 'Undo' });
    await expect(undoButton).toBeDisabled();
    
    // Draw something
    await page.getByRole('button', { name: 'Freehand' }).click();
    const canvas = page.locator('canvas').first();
    await canvas.click();
    
    // Verify undo is now enabled
    await expect(undoButton).toBeEnabled();
    
    // Test undo
    await undoButton.click();
    await expect(undoButton).toBeDisabled();
  });

  test('should persist canvas state across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="floor-plan-wrapper"][data-canvas-ready="true"]');
    
    // Draw something
    await page.getByRole('button', { name: 'Rectangle' }).click();
    const canvas = page.locator('canvas').first();
    await canvas.click();
    
    // Save canvas
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify save toast appears
    await expect(page.getByText('Drawing saved successfully')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Wait for canvas to be ready again
    await page.waitForSelector('[data-testid="floor-plan-wrapper"][data-canvas-ready="true"]');
    
    // Verify canvas has content (undo button should be enabled if there's content)
    await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled();
  });
});
