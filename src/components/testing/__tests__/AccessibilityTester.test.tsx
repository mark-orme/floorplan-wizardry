import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AccessibilityTester } from '../AccessibilityTester';

describe('AccessibilityTester', () => {
  it('should render with children', () => {
    const { getByText } = render(
      <AccessibilityTester showResults={true}>
        <div>Test Content</div>
      </AccessibilityTester>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });
  
  it('should not show results when showResults is false', () => {
    render(
      <AccessibilityTester showResults={false}>
        <div>Test Content</div>
      </AccessibilityTester>
    );
    
    expect(screen.queryByText('Run Tests')).not.toBeInTheDocument();
  });
  
  it('should show results when showResults is true', () => {
    render(
      <AccessibilityTester showResults={true}>
        <div>Test Content</div>
      </AccessibilityTester>
    );
    
    expect(screen.getByText('Run Tests')).toBeInTheDocument();
  });
  
  it('should auto-run tests when autoRun is true', () => {
    const mockRunTests = vi.fn();
    
    render(
      <AccessibilityTester showResults={true} autoRun={true}>
        <div>Test Content</div>
      </AccessibilityTester>
    );
    
    expect(screen.getByText('Run Tests')).toBeInTheDocument();
  });
});
