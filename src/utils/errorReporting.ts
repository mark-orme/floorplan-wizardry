
/**
 * Central error reporting utility
 * Provides consistent error handling and reporting across the application
 */

import { toast } from 'sonner';
import React, { Component, ErrorInfo, ReactNode } from 'react';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface ErrorOptions {
  severity?: ErrorSeverity;
  silent?: boolean;
  metadata?: Record<string, any>;
  context?: string;
}

/**
 * Report an error to the error monitoring system
 */
export function reportError(error: Error | string, options: ErrorOptions = {}) {
  const {
    severity = ErrorSeverity.MEDIUM,
    silent = false,
    metadata = {},
    context = 'app'
  } = options;

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorObject = typeof error === 'string' ? new Error(error) : error;

  // Log to console
  console.error(`[${severity.toUpperCase()}][${context}] ${errorMessage}`, errorObject);

  // Send to monitoring service if available
  if (typeof window !== 'undefined' && window.ErrorReporting) {
    try {
      window.ErrorReporting.captureError(errorObject, {
        severity,
        ...metadata,
        context
      });
    } catch (e) {
      console.error('Error reporting failed:', e);
    }
  }

  // Show UI notification unless silent is true
  if (!silent) {
    toast.error(errorMessage, {
      description: `Error in ${context}`
    });
  }

  // Return the error for chaining
  return errorObject;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Create an error boundary for catching React component errors
 */
export function createErrorBoundary(
  ComponentToWrap: React.ComponentType<any>,
  options: ErrorOptions = {}
) {
  return class ErrorBoundary extends Component<any, ErrorBoundaryState> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      reportError(error, {
        ...options,
        metadata: { ...options.metadata, componentStack: errorInfo.componentStack }
      });
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
            <h3 className="font-semibold">Something went wrong</h3>
            <p className="text-sm">{this.state.error?.message}</p>
          </div>
        );
      }

      return <ComponentToWrap {...this.props} />;
    }
  };
}

// Add global type for error reporting
declare global {
  interface Window {
    ErrorReporting?: {
      captureError: (error: Error, metadata?: any) => void;
    };
  }
}
