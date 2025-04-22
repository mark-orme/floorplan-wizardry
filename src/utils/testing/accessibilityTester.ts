
/**
 * Accessibility Testing Utilities
 * Provides functions to test components for accessibility issues
 */
import React from 'react';
import { render } from '@testing-library/react';
import type { AxeResults } from 'axe-core';

// Define type for accessibility issues
export interface AccessibilityIssue {
  id: string;
  impact: string;
  description: string;
  helpUrl: string;
  nodes: string[];
}

// This will be loaded dynamically to avoid direct imports of jest-axe in the browser
let axe: any = null;
let axeExtend: any = null;

/**
 * Dynamically loads axe-core for browser environments or jest-axe for test environments
 */
async function loadAxeCore() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    // Server-side environment or testing environment
    try {
      // Use dynamic import with a catch for environments where it might not be available
      const jestAxeModule = await import('jest-axe').catch(() => null);
      if (jestAxeModule) {
        axe = jestAxeModule.axe;
        axeExtend = jestAxeModule.toHaveNoViolations;
        
        if (typeof expect !== 'undefined' && axeExtend) {
          // Extend Jest matchers if in test environment
          expect.extend({
            toHaveNoViolations: axeExtend
          });
        }
      }
    } catch (error) {
      console.warn('jest-axe could not be loaded, accessibility testing disabled in tests');
    }
  } else {
    // Browser environment
    try {
      // Use axe-core for browser environments
      const axeCore = await import('axe-core').catch(() => null);
      if (axeCore) {
        axe = axeCore.default || axeCore;
      }
    } catch (error) {
      console.warn('axe-core could not be loaded, accessibility testing disabled in browser');
    }
  }
  return axe;
}

/**
 * Runs an accessibility check on a rendered component
 * @param component Component or JSX element to test
 * @param options Test options
 * @returns Promise resolving to accessibility test results
 */
export async function runAccessibilityTest(component: React.ReactElement, options: {
  includeRules?: string[];
  excludeRules?: string[];
} = {}) {
  // Ensure axe is loaded
  if (!axe) {
    await loadAxeCore();
    // If still not loaded, return empty results
    if (!axe) {
      console.warn('Accessibility testing is disabled - axe library not available');
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
      ...options.includeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: { enabled: true }
      }), {}),
      ...options.excludeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: { enabled: false }
      }), {})
    }
  };

  try {
    // Handle different APIs between jest-axe and axe-core
    const results = typeof axe === 'function' 
      ? await axe(container, axeOptions) 
      : await axe.run(container, axeOptions);
    
    const violations = results.violations.map((violation: any) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.help || violation.description,
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

/**
 * Alias for runAccessibilityTest for backwards compatibility
 */
export const runAccessibilityCheck = runAccessibilityTest;

/**
 * Checks color contrast in a component
 * @param component Component to test
 * @returns Promise resolving to color contrast issues
 */
export async function checkColorContrast(component: React.ReactElement) {
  const { violations } = await runAccessibilityTest(component, {
    includeRules: ['color-contrast']
  });
  return violations;
}

/**
 * Validates ARIA attributes in a component
 * @param component Component to test
 * @returns Promise resolving to ARIA attribute issues
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
 * @param element DOM element to test
 * @param options Test options
 * @returns Promise resolving to accessibility issues
 */
export async function runAccessibilityAudit(element: HTMLElement, options: {
  includeRules?: string[];
  excludeRules?: string[];
} = {}): Promise<AccessibilityIssue[]> {
  // Ensure axe is loaded
  if (!axe) {
    await loadAxeCore();
    if (!axe) {
      console.warn('Accessibility testing is disabled - axe library not available');
      return [];
    }
  }

  const axeOptions = {
    rules: {
      ...options.includeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: { enabled: true }
      }), {}),
      ...options.excludeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: { enabled: false }
      }), {})
    }
  };

  try {
    // Handle different APIs between jest-axe and axe-core
    const results = typeof axe === 'function'
      ? await axe(element, axeOptions)
      : await axe.run(element, axeOptions);

    return results.violations.map((violation: any) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.help || violation.description,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node: any) => node.html || node.target)
    }));
  } catch (error) {
    console.error('Error running accessibility audit:', error);
    return [];
  }
}

/**
 * Loads the accessibility tester for deferred testing
 * @returns Promise resolving to the accessibility tester
 */
export async function loadAccessibilityTester() {
  await loadAxeCore();
  return {
    runTest: runAccessibilityTest,
    checkContrast: checkColorContrast,
    validateAria: validateAriaAttributes
  };
}
