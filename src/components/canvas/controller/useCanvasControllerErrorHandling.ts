
/**
 * Hook for error handling in the canvas controller
 * @module useCanvasControllerErrorHandling
 */
import { useCanvasErrorHandling } from "@/hooks/useCanvasErrorHandling";

interface UseCanvasControllerErrorHandlingProps {
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  resetLoadTimes: () => void;
  loadData: () => void;
}

/**
 * Hook that handles errors in the canvas controller
 * @returns Error handling functions
 */
export const useCanvasControllerErrorHandling = (props: UseCanvasControllerErrorHandlingProps) => {
  const {
    setHasError,
    setErrorMessage,
    resetLoadTimes,
    loadData
  } = props;

  // Error handling and retries
  const { 
    handleRetry 
  } = useCanvasErrorHandling({
    setHasError,
    setErrorMessage,
    resetLoadTimes,
    loadData
  });

  return {
    handleRetry
  };
};
