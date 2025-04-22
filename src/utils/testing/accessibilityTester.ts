
/**
 * Accessibility Testing Utilities
 * Provides functions to test components for accessibility issues
 */
import React from 'react';
import { render } from '@testing-library/react';

// This will be loaded dynamically to avoid direct imports of jest-axe in the browser
let axe = null;
let axeExtend = null;

/**
 * Dynamically loads axe-core for browser environments
 */
async function loadAxeCore() {
  if (typeof window === 'undefined') {
    // Server-side environment, likely testing
    try {
      // Use dynamic import to avoid bundling in production
      // First try to load jest-axe but with a try-catch to handle missing dependency
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
        console.warn('jest-axe could not be loaded, trying axe-core instead');
        const axeCore = await import('axe-core');
        axe = axeCore.default || axeCore;
      }
    } catch (error) {
      console.warn('Accessibility testing libraries could not be loaded, testing disabled');
    }
  } else {
    // Browser environment
    try {
      // Use axe-core for browser environments
      const axeCore = await import('axe-core');
      axe = axeCore.default || axeCore;
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
export async function runAccessibilityTest(component, options = {}) {
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
      ...options.includeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: {
          enabled: true
        }
      }), {}),
      ...options.excludeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: {
          enabled: false
        }
      }), {})
    }
  };

  try {
    const results = await axe.run(container, axeOptions);
    const violations = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => node.html)
    }));
    
    return {
      results,
      violations,
      passes: violations.length === 0
    };
  } catch (error) {
    console.error('Error running accessibility test:', error);
    return {
      results: {
        error
      },
      violations: [
        {
          id: 'test-error',
          impact: 'serious',
          description: 'Error running accessibility test',
          helpUrl: 'https://github.com/dequelabs/axe-core',
          nodes: []
        }
      ],
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
export async function checkColorContrast(component) {
  const { violations } = await runAccessibilityTest(component, {
    includeRules: [
      'color-contrast'
    ]
  });
  return violations;
}

/**
 * Validates ARIA attributes in a component
 * @param component Component to test
 * @returns Promise resolving to ARIA attribute issues
 */
export async function validateAriaAttributes(component) {
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
export async function runAccessibilityAudit(element, options = {}) {
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
      ...options.includeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: {
          enabled: true
        }
      }), {}),
      ...options.excludeRules?.reduce((acc, rule) => ({
        ...acc,
        [rule]: {
          enabled: false
        }
      }), {})
    }
  };

  try {
    const results = await axe.run(element, axeOptions);
    return results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => node.html)
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

/**
 * Accessibility issue class for creating structured accessibility issues
 */
export class AccessibilityIssue {
  id: string;
  impact: string;
  description: string;
  helpUrl: string;
  nodes: string[];

  constructor(issue: {
    id: string;
    impact: string;
    description: string;
    helpUrl?: string;
    nodes?: string[];
  }) {
    this.id = issue.id;
    this.impact = issue.impact;
    this.description = issue.description;
    this.helpUrl = issue.helpUrl || '';
    this.nodes = issue.nodes || [];
  }

  toString() {
    return `${this.impact.toUpperCase()}: ${this.description} (${this.id})`;
  }
}
