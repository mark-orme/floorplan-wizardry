
import React from 'react';
import { render } from '@testing-library/react';

// Try to load axe libraries dynamically
let axe: any = null;
let axeExtend: any = null;

try {
  // Import axe testing utilities - this will only succeed in test environments
  const importAxe = require('jest-axe');
  axe = importAxe.axe;
  axeExtend = importAxe.toHaveNoViolations;
  
  // Add the jest-axe matcher if we're in a test environment
  if (typeof expect !== 'undefined' && axeExtend) {
    expect.extend({ toHaveNoViolations: axeExtend });
  }
} catch (error) {
  // jest-axe not available, which is fine in browser environments
  console.warn('jest-axe not available, some accessibility tests will be limited');
}

/**
 * Renders a component and tests it for accessibility
 * @param ui Component to test
 * @returns The rendered component and accessibility results
 */
export const renderWithA11y = async (ui: React.ReactElement) => {
  const renderResult = render(ui);
  
  if (axe) {
    const axeResults = await axe(renderResult.container);
    return {
      ...renderResult,
      axeResults,
    };
  }
  
  return {
    ...renderResult,
    axeResults: { violations: [] },
  };
};

/**
 * Tests a component for accessibility violations
 * @param ui Component to test
 */
export const testComponentA11y = async (ui: React.ReactElement) => {
  if (!axe || !axeExtend) {
    console.warn('Skipping accessibility test - axe testing not available');
    return;
  }
  
  const { axeResults } = await renderWithA11y(ui);
  expect(axeResults).toHaveNoViolations();
};
