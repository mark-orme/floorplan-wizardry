
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { AccessibilityTester } from '../AccessibilityTester';

describe('AccessibilityTester', () => {
  it('should render without accessibility violations', async () => {
    const { container } = render(<AccessibilityTester />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show only the button when showResults is false', async () => {
    const { container } = render(<AccessibilityTester showResults={false} />);
    
    // Should show the button
    expect(screen.getByRole('button', { name: /Run A11y Tests/i })).toBeInTheDocument();
    
    // Should not show results section
    expect(screen.queryByText(/Issues Found/i)).not.toBeInTheDocument();
    
    // Check for accessibility violations
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should run tests automatically when autoRun is true', async () => {
    // Mock the setTimeout to run immediately
    vi.useFakeTimers();
    
    render(<AccessibilityTester autoRun={true} />);
    
    // Wait for the mock test to complete
    vi.runAllTimers();
    
    // Should show either issues or "No accessibility issues detected"
    expect(
      screen.getByText(/Issues Found/i) || 
      screen.getByText(/No accessibility issues detected/i)
    ).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
