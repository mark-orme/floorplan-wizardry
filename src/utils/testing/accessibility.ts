
import { Page } from '@playwright/test';

/**
 * Run accessibility audit on the current page
 * @param page - Playwright page object
 * @returns Array of accessibility violations
 */
export async function runAccessibilityAudit(page: Page): Promise<Array<any>> {
  // Inject axe-core into the page
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js'
  });

  // Run the accessibility audit
  const violations = await page.evaluate(() => {
    return new Promise(resolve => {
      // @ts-ignore - axe is injected at runtime
      window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }, (err, results) => {
        if (err) {
          console.error('Error running axe:', err);
          resolve([]);
        }
        resolve(results.violations);
      });
    });
  });

  return violations;
}

/**
 * Check if an element has proper ARIA attributes
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Promise resolving to boolean
 */
export async function hasProperAriaAttributes(page: Page, selector: string): Promise<boolean> {
  const hasAriaLabel = await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    return element && (
      element.getAttribute('aria-label') !== null ||
      element.getAttribute('aria-labelledby') !== null
    );
  }, selector);

  return hasAriaLabel;
}

/**
 * Check keyboard navigation on the page
 * @param page - Playwright page object
 * @param selectors - Array of selectors to check for keyboard focus
 * @returns Promise resolving to boolean
 */
export async function checkKeyboardNavigation(page: Page, selectors: string[]): Promise<boolean> {
  // Start by pressing Tab to focus the first focusable element
  await page.keyboard.press('Tab');
  
  // Check if we can Tab through all the specified elements
  for (const selector of selectors) {
    const isFocused = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element === document.activeElement;
    }, selector);
    
    if (!isFocused) {
      await page.keyboard.press('Tab');
      const isFocusedAfterTab = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element === document.activeElement;
      }, selector);
      
      if (!isFocusedAfterTab) {
        return false;
      }
    }
    
    await page.keyboard.press('Tab');
  }
  
  return true;
}

/**
 * Check image accessibility (alt text)
 * @param page - Playwright page object
 * @returns Promise resolving to boolean
 */
export async function checkImageAccessibility(page: Page): Promise<boolean> {
  const imagesWithoutAlt = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.filter(img => !img.hasAttribute('alt')).length;
  });
  
  return imagesWithoutAlt === 0;
}
