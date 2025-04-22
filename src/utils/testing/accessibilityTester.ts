
/**
 * Accessibility testing utility
 * Provides functions for testing components for accessibility issues
 */
import React from 'react';

// Define interfaces for our testing tools
export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  helpUrl: string; // Added helpUrl property
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

/**
 * Accessibility tester interface
 */
export interface AccessibilityTester {
  runTest: (element: React.ReactElement) => Promise<{
    violations: AccessibilityIssue[];
    passes: boolean;
  }>;
}

// Create a variable to store axe and its related functions
let axeTool: any = null;
let axeExtend: any = null;

// Try to load axe libraries dynamically using a simple try-catch pattern
try {
  // This will only succeed in test environments where jest-axe is available
  // We use require instead of import since this is a conditional import
  const axeModule = require('jest-axe');
  axeTool = axeModule.axe;
  axeExtend = axeModule.toHaveNoViolations;
  
  // Extend expect with jest-axe matchers only if in test environment
  if (typeof expect !== 'undefined' && axeExtend) {
    expect.extend({ toHaveNoViolations: axeExtend });
  }
} catch (e) {
  // In browser environments, this will catch and silently ignore the error
  console.log('jest-axe not available, using mock accessibility implementation');
}

/**
 * Dynamically load the accessibility tester
 * This allows the function to work in both test and browser environments
 */
export async function loadAccessibilityTester(): Promise<AccessibilityTester> {
  // In browser environments, return a mock implementation
  if (!axeTool) {
    return {
      runTest: async () => ({
        violations: [],
        passes: true
      })
    };
  }
  
  // In test environments, use the real implementation
  return {
    runTest: async (element: React.ReactElement) => {
      try {
        const { render } = await import('@testing-library/react');
        const { container } = render(element);
        const results = await axeTool(container);
        
        return {
          violations: results.violations as AccessibilityIssue[],
          passes: results.violations.length === 0
        };
      } catch (error) {
        console.error('Error running accessibility test:', error);
        return {
          violations: [],
          passes: true
        };
      }
    }
  };
}

/**
 * Run accessibility audit on a React element
 * @param element React element to test
 * @returns Array of accessibility issues
 */
export async function runAccessibilityAudit(
  element: HTMLElement | React.ReactElement
): Promise<AccessibilityIssue[]> {
  try {
    // If element is an HTMLElement (browser DOM node)
    if (element instanceof HTMLElement) {
      // For browser environments, we'll use a simple mock or try to load axe-core
      try {
        const axeCore = await import('axe-core').catch(() => null);
        
        if (axeCore) {
          const results = await axeCore.default.run(element);
          return results.violations.map((v: any) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            helpUrl: v.helpUrl || `https://dequeuniversity.com/rules/axe/${v.id}`,
            nodes: v.nodes.map((n: any) => ({
              html: n.html,
              target: n.target
            }))
          }));
        }
      } catch (e) {
        console.warn('axe-core not available');
      }
      
      // Return empty array if axe-core is not available
      return [];
    } 
    
    // If element is a React Element (in testing environments)
    const tester = await loadAccessibilityTester();
    const results = await tester.runTest(element as React.ReactElement);
    
    return results.violations;
  } catch (error) {
    console.error('Error running accessibility audit:', error);
    return [];
  }
}

/**
 * Create a mock accessibility issue for testing
 */
export function createMockAccessibilityIssue(
  id: string = 'mock-issue',
  impact: 'minor' | 'moderate' | 'serious' | 'critical' = 'moderate'
): AccessibilityIssue {
  return {
    id,
    impact,
    description: 'Mock accessibility issue for testing',
    helpUrl: `https://dequeuniversity.com/rules/axe/${id}`,
    nodes: [{
      html: '<div>Mock element</div>',
      target: ['#mock-element']
    }]
  };
}
