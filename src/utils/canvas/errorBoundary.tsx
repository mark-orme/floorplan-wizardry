
/**
 * Canvas Error Boundary Component
 * React error boundary specialized for canvas rendering errors
 * @module utils/canvas/errorBoundary
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { handleError } from '@/utils/errorHandling';

interface CanvasErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Fallback component to render on error */
  fallback?: ReactNode;
  /** Function to call when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Function to handle retry attempts */
  onRetry?: () => void;
}

interface CanvasErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Information about where the error occurred */
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component specifically for canvas-related errors
 * Provides error reporting and retry functionality
 */
export class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when error occurs
   * @param {Error} error - The error that was thrown
   * @returns {CanvasErrorBoundaryState} New state with error information
   */
  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  /**
   * Handle errors and collect error information
   * @param {Error} error - The error that occurred
   * @param {ErrorInfo} errorInfo - Information about where the error occurred
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error details
    console.error('Canvas Error:', error, errorInfo);
    
    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Report error to error handling system
    handleError(error, {
      component: 'CanvasErrorBoundary',
      operation: 'render',
      data: { errorInfo }
    });
  }

  /**
   * Handle retry attempts
   */
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI or default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-md p-6">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Canvas Error</h3>
          <p className="text-gray-600 mb-4">Something went wrong with the canvas rendering.</p>
          <div className="bg-gray-100 p-4 rounded text-xs overflow-auto mb-4 max-w-full max-h-40">
            <pre>{this.state.error?.toString()}</pre>
          </div>
          <Button 
            onClick={this.handleRetry} 
            variant="default"
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with the CanvasErrorBoundary
 * @param {React.ComponentType<P>} Component - Component to wrap
 * @param {Omit<CanvasErrorBoundaryProps, 'children'>} errorBoundaryProps - Props for the error boundary
 * @returns {React.FC<P>} Wrapped component with error boundary
 */
export function withCanvasErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<CanvasErrorBoundaryProps, 'children'> = {}
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <CanvasErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </CanvasErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withCanvasErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}
