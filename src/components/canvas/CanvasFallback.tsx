import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';

export interface CanvasFallbackProps {
  error?: Error;
  retry?: () => void;
  fallbackMessage?: string;
  width?: number;
  height?: number;
  showDiagnostics?: boolean;
}

export const CanvasFallback: React.FC<CanvasFallbackProps> = ({
  error,
  retry,
  fallbackMessage = "We're having trouble loading the canvas. Please try again.",
  width,
  height,
  showDiagnostics = false
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  useEffect(() => {
    if (error) {
      console.error('Canvas Error:', error);
      
      captureError(error instanceof Error ? error : new Error(String(error)), {
        cause: {
          component: 'canvas-fallback',
          retryCount: String(retryCount)
        }
      });
      
      toast.error('Canvas failed to load', {
        description: 'Please try refreshing the page or contact support if the issue persists.',
        duration: 5000
      });
    }
  }, [error, retryCount]);
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    if (retry) {
      toast.info('Attempting to reload canvas...', {
        id: 'canvas-reload'
      });
      
      try {
        retry();
        
        setTimeout(() => {
          toast.success('Canvas reloaded successfully', {
            id: 'canvas-reload'
          });
        }, 1000);
      } catch (retryError) {
        console.error('Error retrying canvas load:', retryError);
        
        if (retryError instanceof Error) {
          captureError(retryError, {
            context: 'canvas-fallback-retry',
            tags: {
              component: 'CanvasFallback',
              retryCount: String(retryCount + 1)
            }
          });
        }
        
        toast.error('Failed to reload canvas', {
          id: 'canvas-reload',
          description: 'Please refresh the page or try again later.'
        });
      }
    } else {
      toast.error('Cannot reload canvas component', {
        description: 'Please refresh the page to try again.'
      });
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center"
      style={width || height ? {
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '300px',
        minHeight: '300px'
      } : { minHeight: '300px' }}
    >
      <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Canvas Failed to Load</h3>
      <p className="text-gray-600 mb-4">{fallbackMessage}</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again {retryCount > 0 && `(${retryCount})`}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowDebugInfo(!showDebugInfo)}
        >
          {showDebugInfo ? 'Hide' : 'Show'} Details
        </Button>
      </div>
      
      {showDebugInfo && error && showDiagnostics && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-left w-full overflow-auto max-h-[200px] text-sm">
          <p className="font-mono">{error.name}: {error.message}</p>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-700">
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CanvasFallback;
