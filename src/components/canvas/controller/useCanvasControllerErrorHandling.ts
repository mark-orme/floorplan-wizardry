
import { useCallback } from 'react';
import { captureMessage } from '@/utils/sentryUtils';

interface UseControllerErrorHandlingProps {
  componentName?: string;
  onError?: (error: Error) => void;
}

type ErrorLevel = 'error' | 'warning' | 'info';

/**
 * Hook for handling canvas controller errors
 */
export const useCanvasControllerErrorHandling = ({
  componentName = 'CanvasController',
  onError
}: UseControllerErrorHandlingProps = {}) => {
  const handleError = useCallback((
    error: Error | string, 
    source: string = '',
    level: ErrorLevel = 'error'
  ) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const sourceName = source || 'unknown'; // Provide default for undefined source
    const errorMessage = `[${componentName}] ${sourceName ? `(${sourceName})` : ''}: ${errorObj.message}`;
    
    console.error(errorMessage, errorObj);

    // Capture error for monitoring
    captureMessage(`Canvas error: ${errorObj.message}`, {
      level,
      tags: { component: componentName, source: sourceName }
    });

    // Call onError callback if provided
    if (onError) {
      onError(errorObj);
    }
  }, [componentName, onError]);

  return {
    handleError
  };
};
