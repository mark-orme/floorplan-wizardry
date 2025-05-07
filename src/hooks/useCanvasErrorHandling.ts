
import { useCallback } from 'react';
import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';

interface UseCanvasErrorHandlingOptions {
  onCanvasError?: (error: Error) => void;
  showToast?: boolean;
  logToConsole?: boolean;
  captureToSentry?: boolean;
  componentName?: string;
}

export interface CanvasErrorData {
  message: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
}

export const useCanvasErrorHandling = (options: UseCanvasErrorHandlingOptions = {}) => {
  const {
    onCanvasError,
    showToast = true,
    logToConsole = true,
    captureToSentry = true,
    componentName = 'Canvas'
  } = options;

  const handleCanvasError = useCallback((error: Error | CanvasErrorData) => {
    // Convert error data to Error if needed
    const errorObj = error instanceof Error 
      ? error 
      : new Error(error.message);
    
    // Extract metadata
    const metadata = 'metadata' in error && error.metadata 
      ? error.metadata 
      : {};
    
    // Extract severity
    const severity = 'severity' in error && error.severity
      ? error.severity
      : 'medium';
      
    // Extract source
    const source = 'source' in error && error.source
      ? error.source
      : 'unknown';
      
    // Error message
    const errorMessage = errorObj.message;
    
    // Custom handler if provided
    if (onCanvasError) {
      onCanvasError(errorObj);
    }
    
    // Log to console
    if (logToConsole) {
      console.error(`[${componentName}][${source}] Canvas error:`, errorObj);
    }
    
    // Show toast notification
    if (showToast) {
      toast.error(`Canvas error: ${errorMessage}`);
    }
    
    // Send to error tracking with correct options interface
    if (captureToSentry) {
      captureError(errorObj, { 
        tags: { 
          component: componentName,
          source: source
        },
        extra: { 
          ...metadata,
          message: errorMessage
        },
        level: severity === 'critical' ? 'error' : 
               severity === 'high' ? 'error' :
               severity === 'medium' ? 'warning' : 'info'
      });
    }
  }, [onCanvasError, showToast, logToConsole, captureToSentry, componentName]);
  
  return {
    handleCanvasError
  };
};
