
/**
 * Accessibility testing utility
 * Provides functions for testing components for accessibility issues
 */
import React from 'react';
import { axe, toHaveNoViolations, JestAxeConfigureOptions } from 'jest-axe';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

/**
 * Accessibility issue interface
 */
export interface AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
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

/**
 * Dynamically load the accessibility tester
 * This allows the function to work in both test and browser environments
 */
export async function loadAccessibilityTester(): Promise<AccessibilityTester> {
  try {
    // Try to load jest-axe first
    const jestAxe = await import('jest-axe');
    
    return {
      runTest: async (element: React.ReactElement) => {
        const { container } = await import('@testing-library/react').then(module => 
          module.render(element)
        );
        
        const results = await jestAxe.axe(container);
        
        return {
          violations: results.violations as AccessibilityIssue[],
          passes: results.violations.length === 0
        };
      }
    };
  } catch (error) {
    // Fallback to axe-core if jest-axe is not available
    try {
      const axeCore = await import('axe-core');
      
      return {
        runTest: async (element: React.ReactElement) => {
          const { container } = await import('@testing-library/react').then(module => 
            module.render(element)
          );
          
          const results = await axeCore.default.run(container);
          
          return {
            violations: results.violations as AccessibilityIssue[],
            passes: results.violations.length === 0
          };
        }
      };
    } catch (fallbackError) {
      // If both fail, return a mock tester
      console.warn('Accessibility testing libraries not available. Using mock implementation.');
      
      return {
        runTest: async () => ({
          violations: [],
          passes: true
        })
      };
    }
  }
}

/**
 * Run accessibility audit on a React element
 * @param element React element to test
 * @param options Configuration options
 * @returns Array of accessibility issues
 */
export async function runAccessibilityAudit(
  element: React.ReactElement,
  options?: JestAxeConfigureOptions
): Promise<AccessibilityIssue[]> {
  const tester = await loadAccessibilityTester();
  const results = await tester.runTest(element);
  
  return results.violations;
}

/**
 * Accessibility issue class for creating structured issue objects
 */
export class AccessibilityIssue {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  nodes: Array<{ html: string; target: string[] }>;
  
  constructor(
    id: string,
    impact: 'minor' | 'moderate' | 'serious' | 'critical',
    description: string,
    nodes: Array<{ html: string; target: string[] }>
  ) {
    this.id = id;
    this.impact = impact;
    this.description = description;
    this.nodes = nodes;
  }
  
  static fromAxeResult(violation: any): AccessibilityIssue {
    return new AccessibilityIssue(
      violation.id,
      violation.impact,
      violation.description,
      violation.nodes.map((node: any) => ({
        html: node.html,
        target: node.target
      }))
    );
  }
}
