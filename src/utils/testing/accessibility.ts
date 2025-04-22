
/**
 * Accessibility Testing Utilities
 * Wrapper functions for axe-core for testing components
 */
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';

// Add the jest-axe matcher
expect.extend(toHaveNoViolations);

/**
 * Renders a component and tests it for accessibility
 * @param ui Component to test
 * @returns The rendered component and accessibility results
 */
export const renderWithA11y = async (ui: React.ReactElement) => {
  const renderResult = render(ui);
  const axeResults = await axe(renderResult.container);
  
  return {
    ...renderResult,
    axeResults,
  };
};

/**
 * Tests a component for accessibility violations
 * @param ui Component to test
 */
export const testComponentA11y = async (ui: React.ReactElement) => {
  const { axeResults } = await renderWithA11y(ui);
  expect(axeResults).toHaveNoViolations();
};
