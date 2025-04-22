/**
 * Accessibility Testing Utilities
 * Provides functions to test components for accessibility issues
 */
import { axe, toHaveNoViolations } from 'jest-axe';
import type { Results as AxeResults } from 'axe-core';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';

// Add the jest-axe matcher
expect.extend(toHaveNoViolations);

/**
 * Accessibility issue structure
 */
export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  helpUrl: string;
  nodes: string[];
}

/**
 * Options for accessibility testing
 */
export interface AccessibilityTestOptions {
  /** Rules to include in the test */
  includeRules?: string[];
  /** Rules to exclude from the test */
  excludeRules?: string[];
  /** Whether to run advanced color contrast tests */
  testColorContrast?: boolean;
  /** Whether to test keyboard navigation */
  testKeyboardNav?: boolean;
}

/**
 * Runs an accessibility check on a rendered component
 * @param component Component or JSX element to test
 * @param options Test options
 * @returns Promise resolving to accessibility test results
 */
export async function runAccessibilityTest(
  component: React.ReactElement,
  options: AccessibilityTestOptions = {}
): Promise<{
  results: AxeResults;
  violations: AccessibilityIssue[];
  passes: boolean;
}> {
  const { container } = render(component);
  
  const axeOptions = {
    rules: {
      ...(options.includeRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: true } }), {})),
      ...(options.excludeRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: false } }), {}))
    }
  };
  
  const results = await axe(container, axeOptions);
  
  const violations: AccessibilityIssue[] = results.violations.map(violation => ({
    id: violation.id,
    impact: violation.impact as 'minor' | 'moderate' | 'serious' | 'critical',
    description: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map(node => node.html)
  }));
  
  return {
    results,
    violations,
    passes: violations.length === 0
  };
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
export async function checkColorContrast(
  component: React.ReactElement
): Promise<AccessibilityIssue[]> {
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
export async function validateAriaAttributes(
  component: React.ReactElement
): Promise<AccessibilityIssue[]> {
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
 * Loads the accessibility tester for deferred testing
 * @returns Promise resolving to the accessibility tester
 */
export async function loadAccessibilityTester(): Promise<{
  runTest: typeof runAccessibilityTest;
  checkContrast: typeof checkColorContrast;
  validateAria: typeof validateAriaAttributes;
}> {
  return {
    runTest: runAccessibilityTest,
    checkContrast: checkColorContrast,
    validateAria: validateAriaAttributes
  };
}
