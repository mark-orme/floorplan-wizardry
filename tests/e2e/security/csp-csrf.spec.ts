
import { test, expect } from '@playwright/test';

test.describe('Security Features', () => {
  test('should have security headers set properly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check CSP header (as meta tag)
    const cspMetaTag = await page.$eval(
      'meta[http-equiv="Content-Security-Policy"]', 
      (el) => el.getAttribute('content')
    ).catch(() => null);
    
    expect(cspMetaTag).toBeTruthy();
    
    // Check CSRF token exists
    const csrfMetaTag = await page.$eval(
      'meta[name="csrf-token"]',
      (el) => el.getAttribute('content')
    ).catch(() => null);
    
    expect(csrfMetaTag).toBeTruthy();
    
    // Check if localStorage has CSRF token
    const hasLocalStorageToken = await page.evaluate(() => {
      return !!localStorage.getItem('csrf-token');
    });
    
    expect(hasLocalStorageToken).toBeTruthy();
  });
  
  test('canvas should have accessibility attributes', async ({ page }) => {
    await page.goto('/');
    
    // Wait for canvas to be available
    await page.waitForSelector('canvas');
    
    // Check if the canvas has proper ARIA attributes
    const ariaLabel = await page.$eval('canvas', (el) => el.getAttribute('aria-label')).catch(() => null);
    
    expect(ariaLabel).toBeTruthy();
  });
  
  test('forms should have CSRF protection', async ({ page }) => {
    await page.goto('/');
    
    // Create a test form
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.id = 'test-form';
      form.method = 'post';
      document.body.appendChild(form);
    });
    
    // Wait briefly for the CSRF protection to take effect
    await page.waitForTimeout(100);
    
    // Check if the form has a CSRF input field
    const hasCsrfInput = await page.evaluate(() => {
      const form = document.getElementById('test-form');
      if (!form) return false;
      const inputs = form.querySelectorAll('input[name="csrf-token"]');
      return inputs.length > 0;
    });
    
    expect(hasCsrfInput).toBeTruthy();
  });
});
