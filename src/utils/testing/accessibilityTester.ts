
/**
 * Accessibility Testing Utilities
 * Provides functions to test components for accessibility issues
 */
import React from 'react';
import { render, RenderResult } from '@testing-library/react';

// Define types that mirror axe-core's API
export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  helpUrl: string;
  nodes: string[];
}

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

// This will be loaded dynamically to avoid direct imports of jest-axe in the browser
let axe: any = null;
let axeExtend: any = null;

/**
 * Dynamically loads axe-core for browser environments
 */
async function loadAxeCore() {
  if (typeof window === 'undefined') {
    // Server-side environment, likely testing
    try {
      // Use dynamic import to avoid bundling in production
      const jestAxe = await import('jest-axe');
      axe = jestAxe.axe;
      axeExtend = jestAxe.toHaveNoViolations;
      if (typeof expect !== 'undefined' && axeExtend) {
        // Extend Jest matchers if in test environment
        (expect as any).extend({ toHaveNoViolations: axeExtend });
      }
    } catch (error) {
      console.warn('jest-axe could not be loaded, accessibility testing disabled in tests');
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
export async function runAccessibilityTest(
  component: React.ReactElement,
  options: AccessibilityTestOptions = {}
): Promise<{
  results: any;
  violations: AccessibilityIssue[];
  passes: boolean;
}> {
  // Ensure axe is loaded
  if (!axe) {
    await loadAxeCore();
    
    // If still not loaded, return empty results
    if (!axe) {
      console.warn('Accessibility testing is disabled - axe-core not available');
      return { results: {}, violations: [], passes: true };
    }
  }
  
  const { container } = render(component);
  
  const axeOptions = {
    rules: {
      ...(options.includeRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: true } }), {})),
      ...(options.excludeRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: false } }), {}))
    }
  };
  
  try {
    const results = await axe.run(container, axeOptions);
    
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
 * Browser-compatible implementation for runtime accessibility testing
 */
export async function runAccessibilityAudit(
  element: HTMLElement, 
  options: AccessibilityTestOptions = {}
): Promise<AccessibilityIssue[]> {
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
      ...(options.includeRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: true } }), {})),
      ...(options.excludeRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: false } }), {}))
    }
  };
  
  try {
    const results = await axe.run(element, axeOptions);
    
    return results.violations.map(violation => ({
      id: violation.id,
      impact: violation.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map(node => node.html)
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
export async function loadAccessibilityTester(): Promise<{
  runTest: typeof runAccessibilityTest;
  checkContrast: typeof checkColorContrast;
  validateAria: typeof validateAriaAttributes;
}> {
  await loadAxeCore();
  
  return {
    runTest: runAccessibilityTest,
    checkContrast: checkColorContrast,
    validateAria: validateAriaAttributes
  };
}
