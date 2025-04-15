
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, XCircle } from 'lucide-react';
import { handleError } from '@/utils/errorHandling';

interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Error recovery fallback */
  fallback?: ReactNode;
  /** Component name for error reporting */
  componentName?: string;
  /** Whether to capture errors from this component */
  captureErrors?: boolean;
}

interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** Error message */
  error: Error | null;
  /** Error information */
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in its child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static defaultProps = {
    componentName: 'unknown',
    captureErrors: true
  };
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    const { componentName = 'unknown', captureErrors = true } = this.props;
    
    console.error(`Error caught in ${componentName}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    if (captureErrors) {
      handleError(error, 'error', {
        component: componentName,
        operation: 'render',
        context: { errorInfo: errorInfo.componentStack }
      });
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  renderDefaultFallback(): ReactNode {
    const { error, errorInfo } = this.state;
    
    return (
      <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800 flex flex-col">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-semibold">Something went wrong</h2>
        </div>
        
        <div className="mb-4">
          <p className="font-medium mb-1">Error:</p>
          <p className="font-mono text-sm bg-white p-2 rounded border border-red-200">
            {error?.message || 'Unknown error'}
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && errorInfo && (
          <div className="mb-4">
            <p className="font-medium mb-1">Component Stack:</p>
            <pre className="font-mono text-xs bg-white p-2 rounded border border-red-200 overflow-auto max-h-40">
              {errorInfo.componentStack}
            </pre>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleRetry}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  render(): ReactNode {
    const { children, fallback } = this.props;
    const { hasError } = this.state;
    
    if (hasError) {
      return fallback || this.renderDefaultFallback();
    }
    
    return children;
  }
}
