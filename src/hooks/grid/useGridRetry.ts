
/**
 * Hook for managing grid creation retries
 * Provides automatic retry functionality with backoff
 * @module useGridRetry
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DEFAULT_RETRY_CONFIG, scheduleGridRetry, handleMaxAttemptsReached } from "@/utils/gridRetryUtils";
import { DebugInfoState } from "@/types/drawingTypes";

/**
 * Props for the useGridRetry hook
 * @interface UseGridRetryProps
 */
interface UseGridRetryProps {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
  
  /** Base grid creation callback */
  createGridCallback: (canvas: FabricCanvas) => any[];
  
  /** Setter for debug information state */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  
  /** Setter for error state */
  setHasError: (value: boolean) => void;
  
  /** Setter for error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for grid retry operations
 * @param {UseGridRetryProps} props - Hook properties
 * @returns Memoized grid creation function with retry logic
 */
export const useGridRetry = ({
  gridLayerRef,
  createGridCallback,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseGridRetryProps) => {
  // Track retry attempts
  const attemptCountRef = useRef<number>(0);
  
  // Track retry timeout IDs
  const retryTimeoutRef = useRef<number | null>(null);
  
  /**
   * Create grid with retry capability
   * @param canvas - The Fabric.js canvas instance
   * @returns Created grid objects
   */
  const createGridWithRetry = useCallback((canvas: FabricCanvas): any[] => {
    if (process.env.NODE_ENV === 'development') {
      console.log("createGridWithRetry invoked, attempt #", attemptCountRef.current + 1);
    }
    
    // Increment attempt count
    attemptCountRef.current += 1;
    
    // Check for max attempts
    if (attemptCountRef.current >= DEFAULT_RETRY_CONFIG.maxAttempts) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Max attempts (${DEFAULT_RETRY_CONFIG.maxAttempts}) reached, using emergency grid`);
      }
      return handleMaxAttemptsReached(
        canvas, 
        gridLayerRef, 
        setDebugInfo, 
        setHasError,
        setErrorMessage
      );
    }
    
    try {
      // Try to create grid with base callback
      const grid = createGridCallback(canvas);
      
      // Check if grid created successfully
      if (grid && grid.length > 0) {
        // Reset attempt count on success
        attemptCountRef.current = 0;
        return grid;
      }
      
      // If grid creation failed, schedule retry
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
      }
      
      retryTimeoutRef.current = scheduleGridRetry(
        canvas, 
        attemptCountRef, 
        createGridCallback
      );
      
      return gridLayerRef.current;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error in createGridWithRetry:", error);
      }
      
      // Schedule retry on error
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current);
      }
      
      retryTimeoutRef.current = scheduleGridRetry(
        canvas, 
        attemptCountRef, 
        createGridCallback
      );
      
      return gridLayerRef.current;
    }
  }, [createGridCallback, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);
  
  /**
   * Clean up any pending timeouts
   */
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current !== null) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    attemptCountRef.current = 0;
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return {
    createGridWithRetry,
    cleanup
  };
};
