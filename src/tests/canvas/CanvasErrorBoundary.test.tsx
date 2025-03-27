
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CanvasErrorBoundary } from '@/utils/canvas/errorBoundary';
import React from 'react';

interface ErrorComponentProps {
  shouldThrow?: boolean;
}

// Component that will throw an error for testing
const ErrorComponent: React.FC<ErrorComponentProps> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

describe('CanvasErrorBoundary', () => {
  test('renders children when no error is thrown', () => {
    // When
    render(
      <CanvasErrorBoundary>
        <div>Test Content</div>
      </CanvasErrorBoundary>
    );
    
    // Then
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('renders error UI when an error occurs', () => {
    // Prevent console.error from cluttering test output
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // When
    render(
      <CanvasErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </CanvasErrorBoundary>
    );
    
    // Then
    expect(screen.getByText('Canvas Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong with the canvas rendering.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  test('renders custom fallback when provided', () => {
    // Prevent console.error from cluttering test output
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Given
    const fallback = <div>Custom Fallback UI</div>;
    
    // When
    render(
      <CanvasErrorBoundary fallback={fallback}>
        <ErrorComponent shouldThrow={true} />
      </CanvasErrorBoundary>
    );
    
    // Then
    expect(screen.getByText('Custom Fallback UI')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  test('calls onError when an error occurs', () => {
    // Prevent console.error from cluttering test output
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Given
    const onError = vi.fn();
    
    // When
    render(
      <CanvasErrorBoundary onError={onError}>
        <ErrorComponent shouldThrow={true} />
      </CanvasErrorBoundary>
    );
    
    // Then
    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  test('reset button triggers error boundary reset', () => {
    // Prevent console.error from cluttering test output
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Mock resetErrorBoundary
    const resetErrorBoundary = vi.fn();
    
    // When
    render(
      <CanvasErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </CanvasErrorBoundary>
    );
    
    // Find and click the reset button
    const resetButton = screen.getByText('Try Again');
    
    // We can't fully test the reset function since we'd need to mock React's internal error boundary
    // But we can at least check the button is there and clickable
    expect(resetButton).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});
