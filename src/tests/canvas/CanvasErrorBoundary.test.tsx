
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '@/utils/canvas/errorBoundary';

// Mock error handling utilities
vi.mock('@/utils/errorHandling', () => ({
  handleError: vi.fn()
}));

// Create a component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
  return <div>This won't render</div>;
};

// Create a component that doesn't throw an error
const NormalComponent = () => {
  return <div>Normal component rendered successfully</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console errors during tests
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>} component="TestComponent">
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component rendered successfully')).toBeInTheDocument();
  });

  it('renders fallback when error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Something went wrong</div>} component="TestComponent">
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders custom fallback when provided and error occurs', () => {
    render(
      <ErrorBoundary 
        fallback={<div>Custom error: Canvas initialization failed</div>} 
        component="TestComponent"
      >
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error: Canvas initialization failed')).toBeInTheDocument();
  });
});
