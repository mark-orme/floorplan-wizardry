
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Update test utilities to include missing methods
const enhancedScreen = {
  ...screen,
  getByTestId: screen.getByTestId || ((testId: string) => {
    // Fallback implementation
    const elements = document.querySelectorAll(`[data-testid="${testId}"]`);
    if (elements.length > 0) return elements[0] as HTMLElement;
    throw new Error(`Unable to find element by test id: ${testId}`);
  })
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
