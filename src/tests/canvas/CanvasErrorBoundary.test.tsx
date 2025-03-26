
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CanvasErrorBoundary } from '@/utils/canvas/errorBoundary';
import React from 'react';

// Component that will throw an error for testing
const ErrorComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
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
});
