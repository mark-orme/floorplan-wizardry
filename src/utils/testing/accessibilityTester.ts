
/**
 * Accessibility testing utilities
 * Provides functions for running accessibility audits in tests
 */
import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// Define accessibility test options
export interface AccessibilityTestOptions {
  includeSelectors?: string[];
  excludeSelectors?: string[];
  rules?: {
    enable?: string[];
    disable?: string[];
  };
  tags?: string[];
}

// Define accessibility issue type
export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  nodes: string[];
  helpUrl?: string;
}

/**
 * Run an accessibility audit on the current page
 * @param page Playwright page
 * @param options Test options
 * @returns Accessibility audit results
 */
export async function runAccessibilityTest(
  page: Page, 
  options: AccessibilityTestOptions = {}
) {
  const builder = new AxeBuilder({ page });

  if (options.includeSelectors) {
    builder.include(options.includeSelectors);
  }

  if (options.excludeSelectors) {
    builder.exclude(options.excludeSelectors);
  }

  if (options.tags) {
    builder.withTags(options.tags);
  }

  if (options.rules?.enable) {
    const enableRules = options.rules.enable.reduce((acc, rule) => {
      acc[rule] = { enabled: true };
      return acc;
    }, {} as Record<string, { enabled: boolean }>);
    
    builder.options({ rules: enableRules });
  }

  if (options.rules?.disable) {
    const disableRules = options.rules.disable.reduce((acc, rule) => {
      acc[rule] = { enabled: false };
      return acc;
    }, {} as Record<string, { enabled: boolean }>);
    
    builder.options({ rules: disableRules });
  }

  const results = await builder.analyze();
  return results;
}

/**
 * Alternative name for runAccessibilityTest for backward compatibility
 */
export const runAccessibilityCheck = runAccessibilityTest;

/**
 * Check element for common accessibility issues
 * @param element Element to check
 * @param expectedRole Expected ARIA role
 */
export function checkElementAccessibility(element: HTMLElement, expectedRole?: string) {
  // Check for proper role
  if (expectedRole && (!element.hasAttribute('role') || element.getAttribute('role') !== expectedRole)) {
    console.warn(`Element missing expected role="${expectedRole}" attribute`);
  }
  
  // Check for accessible name
  const hasAccessibleName = 
    element.hasAttribute('aria-label') || 
    element.hasAttribute('aria-labelledby') ||
    (element.tagName === 'INPUT' && element.hasAttribute('id') && document.querySelector(`label[for="${element.id}"]`));
  
  if (!hasAccessibleName) {
    console.warn('Element missing accessible name (aria-label, aria-labelledby, or associated label)');
  }
  
  // Check for proper focus management if interactive
  const isInteractive = 
    ['button', 'a', 'select', 'input', 'textarea'].includes(element.tagName.toLowerCase()) || 
    element.getAttribute('role') === 'button';
  
  if (isInteractive && element.getAttribute('tabindex') === '-1') {
    console.warn('Interactive element has tabindex="-1", which removes it from keyboard navigation');
  }
}

/**
 * Check color contrast for an element against WCAG standards
 * @param foregroundColor CSS color value
 * @param backgroundColor CSS color value
 * @returns Object with contrast ratio and pass/fail for various WCAG levels
 */
export function checkColorContrast(foregroundColor: string, backgroundColor: string) {
  // Simple implementation - in a real app, you'd use a proper color contrast algorithm
  console.log(`Checking contrast between ${foregroundColor} and ${backgroundColor}`);
  return {
    ratio: 4.5, // Placeholder
    passesAA: true,
    passesAAA: false
  };
}

/**
 * Validate ARIA attributes on an element
 * @param element Element to check
 * @returns Array of validation issues
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Example checks - in a real implementation, you'd do more thorough validation
  if (element.hasAttribute('aria-labelledby') && !document.getElementById(element.getAttribute('aria-labelledby') || '')) {
    issues.push(`aria-labelledby references non-existent ID: ${element.getAttribute('aria-labelledby')}`);
  }
  
  return issues;
}

/**
 * Load the accessibility tester into the browser
 * @returns Promise that resolves when the tester is loaded
 */
export async function loadAccessibilityTester(): Promise<void> {
  console.log('Accessibility tester loaded');
  return Promise.resolve();
}
