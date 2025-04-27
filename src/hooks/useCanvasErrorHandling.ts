
import { useCallback } from 'react';
import { toast } from 'sonner';
import { captureError } from '@/utils/sentryUtils';

interface UseCanvasErrorHandlingOptions {
  onCanvasError?: (error: Error) => void;
  showToast?: boolean;
  logToConsole?: boolean;
  captureToSentry?: boolean;
}

export const useCanvasErrorHandling = (options: UseCanvasErrorHandlingOptions = {}) => {
  const {
    onCanvasError,
    showToast = true,
    logToConsole = true,
    captureToSentry = true
  } = options;

  const handleCanvasError = useCallback((error: Error) => {
    // Custom handler if provided
    if (onCanvasError) {
      onCanvasError(error);
    }
    
    // Log to console
    if (logToConsole) {
      console.error('Canvas error:', error);
    }
    
    // Show toast notification
    if (showToast) {
      toast.error(`Canvas error: ${error.message}`);
    }
    
    // Send to error tracking
    if (captureToSentry) {
      captureError(error, { 
        level: 'error',
        tags: { component: 'Canvas' },
        extra: { message: error.message }
      });
    }
  }, [onCanvasError, showToast, logToConsole, captureToSentry]);
  
  return {
    handleCanvasError
  };
};
