
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface UseCanvasErrorHandlingProps {
  onErrorCallback?: (error: Error) => void;
}

/**
 * Hook for handling canvas errors consistently
 */
export const useCanvasErrorHandling = ({ onErrorCallback }: UseCanvasErrorHandlingProps) => {
  const handleError = useCallback((error: Error, source: string = 'unknown') => {
    console.error(`Canvas error (${source}):`, error);
    
    // Show toast notification
    toast.error(`Canvas error: ${error.message}`, {
      description: 'Please try reloading if problems persist',
      duration: 5000
    });
    
    // Call error callback if provided
    if (onErrorCallback) {
      onErrorCallback(error);
    }
    
    return error;
  }, [onErrorCallback]);
  
  return { handleError };
};
