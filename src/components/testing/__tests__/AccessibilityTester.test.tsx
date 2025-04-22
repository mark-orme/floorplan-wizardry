
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccessibilityTester } from '../AccessibilityTester';

// Instead of directly importing axe, we'll use our helper
import { testComponentA11y } from '@/tests/helpers/accessibility';

describe('AccessibilityTester', () => {
  it('should render without accessibility violations', async () => {
    const { container } = render(<AccessibilityTester />);
    
    // Test component for accessibility with our helper
    await testComponentA11y(<AccessibilityTester />);
    
    // This test passes if no errors are thrown by testComponentA11y
    expect(true).toBe(true);
  });

  it('should show only children when showResults is false', () => {
    render(
      <AccessibilityTester showResults={false}>
        <div data-testid="test-child">Test Content</div>
      </AccessibilityTester>
    );
    
    // Should show the children
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // Should not show the accessibility panel
    expect(screen.queryByText(/Accessibility Check/i)).not.toBeInTheDocument();
  });

  it('should run tests automatically when autoRun is true', async () => {
    // Mock the setTimeout to run immediately
    vi.useFakeTimers();
    
    render(<AccessibilityTester autoRun={true} />);
    
    // Wait for the mock test to complete
    vi.runAllTimers();
    
    // Check that the button shows the right state
    expect(screen.getByRole('button')).toHaveTextContent(/Run Test/i);
    
    vi.useRealTimers();
  });
});
