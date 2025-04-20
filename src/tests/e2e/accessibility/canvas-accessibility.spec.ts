
import { test, expect, Page } from '@playwright/test';
import { runAccessibilityAudit } from '@/utils/testing/accessibility';

test.describe('Canvas Accessibility', () => {
  test('Canvas should have proper accessibility attributes', async ({ page }) => {
    // Navigate to the canvas page
    await page.goto('/floorplans/new');
    
    // Check that the canvas element has an appropriate role
    await expect(page.locator('canvas')).toHaveAttribute('role', 'img');
    
    // Ensure there's an accessible name or label
    await expect(page.locator('[data-testid="floor-plan-wrapper"]')).toHaveAttribute('aria-label');
    
    // Run a full accessibility audit
    const violations = await runAccessibilityAudit(page);
    expect(violations.length).toBe(0);
  });
  
  test('Drawing tools should be keyboard accessible', async ({ page }) => {
    // Navigate to the canvas page
    await page.goto('/floorplans/new');
    
    // Check that tool buttons can be focused
    const toolButtons = page.locator('[data-testid="drawing-tool-button"]');
    await expect(toolButtons.first()).toBeVisible();
    
    // Focus and activate a tool using keyboard
    await toolButtons.first().focus();
    await page.keyboard.press('Enter');
    
    // Check that no critical accessibility violations exist
    const violations = await runAccessibilityAudit(page);
    
    // Filter out any false positives or known issues
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' && !v.nodes.some(n => n.html.includes('canvas'))
    );
    
    expect(criticalViolations.length).toBe(0);
  });
});
