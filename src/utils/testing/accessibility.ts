
import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// Define accessibility audit options
export interface AccessibilityAuditOptions {
  includeSelectors?: string[];
  excludeSelectors?: string[];
  includeRoles?: string[];
  excludeRoles?: string[];
  rules?: {
    enable?: string[];
    disable?: string[];
  };
}

/**
 * Run an accessibility audit on the current page
 * @param page Playwright page
 * @param options Audit options
 * @returns Array of violations
 */
export async function runAccessibilityAudit(
  page: Page, 
  options: AccessibilityAuditOptions = {}
) {
  const builder = new AxeBuilder({ page });

  if (options.includeSelectors) {
    builder.include(options.includeSelectors);
  }

  if (options.excludeSelectors) {
    builder.exclude(options.excludeSelectors);
  }

  if (options.rules?.enable) {
    builder.options({ rules: options.rules.enable.reduce((acc, rule) => {
      acc[rule] = { enabled: true };
      return acc;
    }, {} as Record<string, { enabled: boolean }>) });
  }

  const results = await builder.analyze();
  return results.violations;
}

/**
 * Check dialog accessibility
 * @param element Element to check
 */
export function checkDialogAccessibility(element: HTMLElement) {
  const hasRole = element.hasAttribute('role') && element.getAttribute('role') === 'dialog';
  const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  const hasDescription = element.hasAttribute('aria-describedby');
  
  if (!hasRole) {
    console.warn('Dialog missing role="dialog" attribute');
  }
  
  if (!hasLabel) {
    console.warn('Dialog missing aria-label or aria-labelledby attribute');
  }
  
  if (!hasDescription) {
    console.warn('Dialog missing aria-describedby attribute');
  }
}
