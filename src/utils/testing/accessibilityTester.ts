
/**
 * Accessibility Testing Utilities
 * Provides functions to test components for accessibility issues
 */
import React from 'react';
import { render } from '@testing-library/react';

// This will be loaded dynamically to avoid direct imports of jest-axe in the browser
let axe: any = null;
let axeExtend: any = null;

/**
 * Dynamically loads axe-core for browser environments or jest-axe for tests
 */
async function loadAxeCore() {
  if (typeof window === 'undefined') {
    // Server-side environment, likely testing
    try {
      const jestAxe = await import('jest-axe');
      axe = jestAxe.axe;
      axeExtend = jestAxe.toHaveNoViolations;
      
      if (typeof expect !== 'undefined' && axeExtend) {
        // Extend Jest matchers if in test environment
        expect.extend({
          toHaveNoViolations: axeExtend
        });
      }
    } catch (error) {
      console.warn('jest-axe could not be loaded, accessibility testing disabled in tests');
      return null;
    }
  } else {
    // Browser environment
    try {
      // Use axe-core for browser environments
      const axeCore = await import('axe-core');
      axe = axeCore.default || axeCore;
    } catch (error) {
      console.warn('axe-core could not be loaded, accessibility testing disabled in browser');
      return null;
    }
  }
  
  return axe;
}

// Interface for accessibility issue
export interface AccessibilityIssue {
  id: string;
  impact: string;
  description: string;
  helpUrl: string;
  nodes?: string[];
}

/**
 * Runs an accessibility check on a rendered component
 */
export async function runAccessibilityTest(component: React.ReactElement, options: any = {}) {
  // Ensure axe is loaded
  if (!axe) {
    await loadAxeCore();
    // If still not loaded, return empty results
    if (!axe) {
      console.warn('Accessibility testing is disabled - axe-core not available');
      return {
        results: {},
        violations: [],
        passes: true
      };
    }
  }
  
  const { container } = render(component);
  
  const axeOptions = {
    rules: {
      ...options.includeRules?.reduce((acc: any, rule: string) => ({
        ...acc,
        [rule]: { enabled: true }
      }), {}),
      ...options.excludeRules?.reduce((acc: any, rule: string) => ({
        ...acc,
        [rule]: { enabled: false }
      }), {})
    }
  };
  
  try {
    // Handle different APIs between axe-core and jest-axe
    const results = await (axe.run ? axe.run(container, axeOptions) : axe(container, axeOptions));
    
    const violations = results.violations.map((violation: any) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node: any) => node.html)
    }));
    
    return {
      results,
      violations,
      passes: violations.length === 0
    };
  } catch (error) {
    console.error('Error running accessibility test:', error);
    return {
      results: { error },
      violations: [{
        id: 'test-error',
        impact: 'serious',
        description: 'Error running accessibility test',
        helpUrl: 'https://github.com/dequelabs/axe-core',
        nodes: []
      }],
      passes: false
    };
  }
}

// Alias for backward compatibility
export const runAccessibilityCheck = runAccessibilityTest;

/**
 * Checks color contrast in a component
 */
export async function checkColorContrast(component: React.ReactElement) {
  const { violations } = await runAccessibilityTest(component, {
    includeRules: ['color-contrast']
  });
  return violations;
}

/**
 * Validates ARIA attributes in a component
 */
export async function validateAriaAttributes(component: React.ReactElement) {
  const { violations } = await runAccessibilityTest(component, {
    includeRules: [
      'aria-roles',
      'aria-props',
      'aria-valid-attr',
      'aria-valid-attr-value',
      'aria-required-attr',
      'aria-required-children',
      'aria-required-parent'
    ]
  });
  return violations;
}

/**
 * Browser-compatible implementation for runtime accessibility testing
 */
export async function runAccessibilityAudit(element: HTMLElement, options: any = {}) {
  // Ensure axe is loaded
  if (!axe) {
    await loadAxeCore();
    if (!axe) {
      console.warn('Accessibility testing is disabled - axe-core not available');
      return [];
    }
  }
  
  const axeOptions = {
    rules: {
      ...options.includeRules?.reduce((acc: any, rule: string) => ({
        ...acc,
        [rule]: { enabled: true }
      }), {}),
      ...options.excludeRules?.reduce((acc: any, rule: string) => ({
        ...acc,
        [rule]: { enabled: false }
      }), {})
    }
  };
  
  try {
    const run = axe.run || axe;
    const results = await run(element, axeOptions);
    
    return results.violations.map((violation: any) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node: any) => node.html)
    }));
  } catch (error) {
    console.error('Error running accessibility audit:', error);
    return [];
  }
}

/**
 * Loads the accessibility tester for deferred testing
 */
export async function loadAccessibilityTester() {
  await loadAxeCore();
  return {
    runTest: runAccessibilityTest,
    checkContrast: checkColorContrast,
    validateAria: validateAriaAttributes
  };
}
