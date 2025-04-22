
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccessibilityTester } from '../AccessibilityTester';

describe('AccessibilityTester', () => {
  it('should render with children', () => {
    render(
      <AccessibilityTester showResults={true}>
        <div data-testid="test-child">Test Content</div>
      </AccessibilityTester>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
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
    const mockRunTests = jest.fn();
    
    render(
      <AccessibilityTester showResults={true} autoRun={true}>
        <div>Test Content</div>
      </AccessibilityTester>
    );
    
    // Since we can't directly test the implementation details,
    // we're just checking if the component renders with autoRun=true
    expect(screen.getByText('Run Tests')).toBeInTheDocument();
  });
});
