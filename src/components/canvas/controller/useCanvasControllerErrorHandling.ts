
import { useCallback } from 'react';
import { captureMessage } from '@/utils/sentryUtils';

interface UseControllerErrorHandlingProps {
  componentName?: string;
  onError?: (error: Error) => void;
}

/**
 * Hook for handling canvas controller errors
 */
export const useCanvasControllerErrorHandling = ({
  componentName = 'CanvasController',
  onError
}: UseControllerErrorHandlingProps = {}) => {
  const handleError = useCallback((error: Error, source: string = '') => {
    const sourceName = source || 'unknown'; // Provide default for undefined source
    const errorMessage = `[${componentName}] ${sourceName ? `(${sourceName})` : ''}: ${error.message}`;
    
    console.error(errorMessage, error);

    // Capture error for monitoring
    captureMessage(`Canvas error: ${error.message}`, {
      level: 'error',
      tags: { component: componentName, source: sourceName }
    });

    // Call onError callback if provided
    if (onError) {
      onError(error);
    }
  }, [componentName, onError]);

  return {
    handleError
  };
};
