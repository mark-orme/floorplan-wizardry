
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface CanvasErrorHandlingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
}

export const useCanvasErrorHandling = (options: CanvasErrorHandlingOptions = {}) => {
  const { showToast = true, logToConsole = true } = options;
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCanvasError = useCallback((error: Error) => {
    setHasError(true);
    setErrorMessage(error.message || 'An error occurred with the canvas');
    
    if (logToConsole) {
      console.error('Canvas error:', error);
    }
    
    if (showToast) {
      toast.error('There was an error loading the canvas. Please try again.');
    }
  }, [showToast, logToConsole]);

  const resetCanvasError = useCallback(() => {
    setHasError(false);
    setErrorMessage(null);
  }, []);

  return {
    hasError,
    errorMessage,
    handleCanvasError,
    resetCanvasError
  };
};
