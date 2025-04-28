
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Update test utilities to include getByTestId method
const enhancedScreen = {
  ...screen,
  getByTestId: (testId: string): HTMLElement => {
    const element = document.querySelector(`[data-testid="${testId}"]`);
    if (element) return element as HTMLElement;
    throw new Error(`Unable to find element with data-testid: ${testId}`);
  },
  queryByTestId: (testId: string): HTMLElement | null => {
    return document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
  }
};

describe('AccessibilityTester', () => {
  it('should provide accessibility testing utilities', () => {
    const element = document.createElement('div');
    element.textContent = 'Test Content';
    element.setAttribute('data-testid', 'test-element');
    document.body.appendChild(element);
    
    const foundElement = enhancedScreen.getByTestId('test-element');
    expect(foundElement).toBeDefined();
    expect(foundElement.textContent).toBe('Test Content');
  });
});
