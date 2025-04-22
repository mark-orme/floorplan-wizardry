
import { useState, useCallback } from 'react';

interface CanvasErrorHandlingOptions {
  onCanvasError?: (error: Error) => void;
}

export function useCanvasErrorHandling(options: CanvasErrorHandlingOptions = {}) {
  const { onCanvasError } = options;
  
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleCanvasError = useCallback((error: Error) => {
    console.error('Canvas error:', error);
    setHasError(true);
    setErrorMessage(error.message);
    
    if (onCanvasError) {
      onCanvasError(error);
    }
  }, [onCanvasError]);
  
  const resetCanvasError = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
  }, []);
  
  return {
    hasError,
    errorMessage,
    handleCanvasError,
    resetCanvasError
  };
}
