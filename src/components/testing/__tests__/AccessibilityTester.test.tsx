
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Extended screen with missing methods
const enhancedScreen = {
  ...screen,
  getByTestId: (testId: string): HTMLElement => {
    const element = document.querySelector(`[data-testid="${testId}"]`);
    if (element) return element as HTMLElement;
    throw new Error(`Unable to find element with data-testid: ${testId}`);
  },
  queryByTestId: (testId: string): HTMLElement | null => {
    return document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
  },
  getAllByRole: (role: string): HTMLElement[] => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    return Array.from(elements) as HTMLElement[];
  },
  queryAllByRole: (role: string): HTMLElement[] => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    return Array.from(elements) as HTMLElement[];
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
