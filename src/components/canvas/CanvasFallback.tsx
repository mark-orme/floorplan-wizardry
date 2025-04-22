import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info, Bug } from 'lucide-react';
import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';

interface CanvasFallbackProps {
  error: Error | null;
  onRetry?: () => void;
  width?: number;
  height?: number;
  showDiagnostics?: boolean;
}

/**
 * Fallback component that renders when canvas fails to initialize
 * Provides useful error information and retry options
 */
export const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  error,
  onRetry,
  width = 800,
  height = 600,
  showDiagnostics = false
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [errorText, setError] = React.useState('');

  // Capture the fallback render in analytics
  React.useEffect(() => {
    captureError(
      error || new Error('Canvas initialization failed'), 
      'canvas-fallback-rendered', 
      {
        level: 'warning',
        tags: {
          component: 'CanvasFallback',
          errorType: error?.message?.includes('elements.lower.el') ? 'lower-el-error' : 'other-error'
        },
        extra: {
          errorMessage: error?.message,
          errorStack: error?.stack,
          dimensions: { width, height },
          domState: {
            readyState: document.readyState,
            canvasCount: document.querySelectorAll('canvas').length
          }
        }
      }
    );
  }, [error, width, height]);

  // Is this the common lower.el error?
  const isLowerElError = error?.message?.includes('elements.lower.el') || false;
  
  // Get diagnostic information
  const getDiagnosticInfo = () => {
    return {
      browser: navigator.userAgent,
      devicePixelRatio: window.devicePixelRatio,
      dimensions: { width, height, 
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      },
      timing: {
        navigationStart: performance.timing?.navigationStart,
        domContentLoaded: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart,
        loadEvent: performance.timing?.loadEventEnd - performance.timing?.navigationStart
      },
      canvasCount: document.querySelectorAll('canvas').length,
      errorInfo: error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : 'No error information'
    };
  };
  
  const errorInfo = getDiagnosticInfo();
  
  // Force page reload - sometimes this is the only way to fix certain canvas issues
  const handleForceReload = () => {
    captureError(
      new Error('User forced page reload from canvas fallback'), 
      'canvas-fallback-force-reload',
      {
        level: 'info',
        tags: {
          component: 'CanvasFallback',
          action: 'force-reload'
        }
      }
    );
    window.location.reload();
  };

  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error);
    setError(error.message);
    
    // Use correct parameter count
    captureError(error, {
      context: 'canvas-fallback'
    });
  };

  try {
    // Capture the initialization error in analytics
    captureError(
      error || new Error('Canvas initialization failed'), 
      'canvas-fallback-init', 
      {
        level: 'warning',
        tags: {
          component: 'CanvasFallback',
          errorType: error?.message?.includes('elements.lower.el') ? 'lower-el-error' : 'other-error'
        },
        extra: {
          errorMessage: error?.message,
          errorStack: error?.stack,
          dimensions: { width, height },
          domState: {
            readyState: document.readyState,
            canvasCount: document.querySelectorAll('canvas').length
          }
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      captureError(error, {
        context: 'canvas-fallback-init'
      });
    }
  }

  return (
    <div 
      className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-6 bg-gray-50"
      style={{ width: width > 0 ? width : 'auto', height: height > 0 ? height : 400, minHeight: 300 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Bug className="h-8 w-8 text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Canvas Initialization Failed</h3>
      
      <p className="text-gray-600 text-center mb-4 max-w-md">
        {isLowerElError 
          ? "We encountered a known issue with the canvas initialization. This is often fixed by refreshing the page."
          : "We couldn't initialize the drawing canvas. This might be due to browser restrictions or resource limitations."}
      </p>
      
      {error && (
        <div className="text-sm text-red-500 mb-4 max-w-md text-center">
          Error: {error.message}
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
        
        <Button
          variant="default"
          onClick={handleForceReload}
          className="flex items-center gap-2"
        >
          Refresh Page
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2"
          size="sm"
        >
          <Info className="h-4 w-4" />
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>
      
      {showDetails && showDiagnostics && (
        <div className="w-full max-w-lg mt-4">
          <details className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-60">
            <summary className="font-medium cursor-pointer">Diagnostic Information</summary>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(errorInfo, null, 2)}</pre>
          </details>
          
          <div className="mt-4 text-xs text-gray-500">
            <h4 className="font-medium mb-1">Troubleshooting Steps:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Try refreshing the page</li>
              <li>Check your browser is up to date</li>
              <li>Try disabling browser extensions</li>
              <li>If on mobile, ensure you have enough free memory</li>
              <li>Try using a different browser</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
