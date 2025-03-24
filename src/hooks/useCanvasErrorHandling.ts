
/**
 * Custom hook for canvas error handling and retries
 * @module useCanvasErrorHandling
 */
import { useCallback } from "react";
import { toast } from "sonner";

interface UseCanvasErrorHandlingProps {
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  resetLoadTimes: () => void;
  loadData: () => Promise<any>;
}

/**
 * Hook for managing canvas error states and retry functionality
 * @param {UseCanvasErrorHandlingProps} props - Hook properties
 * @returns {Object} Error handling utilities
 */
export const useCanvasErrorHandling = ({
  setHasError,
  setErrorMessage,
  resetLoadTimes,
  loadData
}: UseCanvasErrorHandlingProps) => {
  
  /**
   * Handle retry after an error occurs
   */
  const handleRetry = useCallback(() => {
    resetLoadTimes();
    loadData();
  }, [loadData, resetLoadTimes]);

  /**
   * Handle specific errors
   * @param error - The error that occurred
   * @param context - Context description for the error
   */
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Error ${context}:`, error);
    setHasError(true);
    setErrorMessage(`Failed to ${context}: ${error instanceof Error ? error.message : String(error)}`);
    toast.error(`Failed to ${context}`);
  }, [setHasError, setErrorMessage]);

  return {
    handleRetry,
    handleError
  };
};
