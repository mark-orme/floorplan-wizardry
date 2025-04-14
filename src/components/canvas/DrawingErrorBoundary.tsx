
/**
 * Drawing error boundary component
 * Provides error catching and reporting for drawing operations
 * @module components/canvas/DrawingErrorBoundary
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureError } from '@/utils/sentry';
import { toast } from 'sonner';

interface DrawingErrorBoundaryProps {
  /** Component name for error reporting */
  componentName: string;
  /** Tool name being used */
  tool?: string;
  /** Children to render */
  children: ReactNode;
  /** Optional fallback UI */
  fallback?: ReactNode;
}

interface DrawingErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for drawing operations
 * Catches errors during drawing and provides recovery options
 */
export class DrawingErrorBoundary extends Component<DrawingErrorBoundaryProps, DrawingErrorBoundaryState> {
  constructor(props: DrawingErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  
  /**
   * Update state when error occurs
   */
  static getDerivedStateFromError(error: Error): DrawingErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }
  
  /**
   * Report error to monitoring system
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentName, tool } = this.props;
    
    // Report to Sentry with enhanced context
    captureError(error, 'drawing-component-error', {
      tags: {
        component: componentName,
        tool: tool || 'unknown',
        errorType: error.name
      },
      extra: {
        componentStack: errorInfo.componentStack,
        errorMessage: error.message,
        errorStack: error.stack
      },
      context: {
        componentName,
        tool,
        errorInfo
      }
    });
    
    // Show user-friendly error message
    toast.error('Drawing operation failed. Try again or switch tools.', {
      duration: 5000,
      action: {
        label: 'Retry',
        onClick: () => this.resetError()
      }
    });
  }
  
  /**
   * Reset error state to allow retry
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };
  
  render(): ReactNode {
    const { hasError } = this.state;
    const { children, fallback } = this.props;
    
    if (hasError) {
      // Show fallback UI if provided, otherwise show minimal retry button
      return fallback || (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <h3 className="text-red-800 text-sm font-medium mb-2">
            Drawing operation failed
          </h3>
          <button
            className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
            onClick={this.resetError}
          >
            Retry drawing
          </button>
        </div>
      );
    }
    
    return children;
  }
}
