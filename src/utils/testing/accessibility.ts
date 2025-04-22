
/**
 * Accessibility Testing Utilities
 * Wrapper functions for axe-core for testing components
 */
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

/**
 * Helper type for axe-builder options
 */
export interface AccessibilityAuditOptions {
  includeSelectors?: string[];
  excludeSelectors?: string[];
  tags?: string[];
}

/**
 * Run an accessibility audit on a page with Playwright
 * @param page Playwright page object
 * @param options Audit options
 * @returns Array of accessibility violations
 */
export const runAccessibilityAudit = async (page: Page, options: AccessibilityAuditOptions = {}) => {
  let axeBuilder = new AxeBuilder({ page });
  
  if (options.includeSelectors) {
    options.includeSelectors.forEach(selector => {
      axeBuilder = axeBuilder.include(selector);
    });
  }
  
  if (options.excludeSelectors) {
    options.excludeSelectors.forEach(selector => {
      axeBuilder = axeBuilder.exclude(selector);
    });
  }
  
  if (options.tags) {
    axeBuilder = axeBuilder.withTags(options.tags);
  }
  
  const result = await axeBuilder.analyze();
  return result.violations;
};
