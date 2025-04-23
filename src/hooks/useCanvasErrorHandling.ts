
import { useCallback } from 'react';

interface UseCanvasErrorHandlingProps {
  onCanvasError?: (error: Error) => void;
}

/**
 * Hook for centralizing canvas error handling
 */
export const useCanvasErrorHandling = ({ 
  onCanvasError 
}: UseCanvasErrorHandlingProps) => {
  /**
   * Handle canvas errors
   */
  const handleCanvasError = useCallback((error: Error) => {
    console.error('Canvas error:', error);
    
    // Call provided error handler if available
    if (onCanvasError) {
      onCanvasError(error);
    }
  }, [onCanvasError]);
  
  return {
    handleCanvasError
  };
};
