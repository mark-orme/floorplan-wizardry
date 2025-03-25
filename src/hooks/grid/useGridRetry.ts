
/**
 * Hook for managing grid creation retry logic
 * Handles retry attempts, throttling, and recovery
 * @module useGridRetry
 */
import { useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { 
  scheduleGridRetry, 
  DEFAULT_RETRY_CONFIG,
  handleMaxAttemptsReached 
} from "@/utils/gridRetryUtils";
import { shouldThrottleGridCreation } from "@/utils/gridValidationUtils";
import { DebugInfoState } from "@/types/drawingTypes";
import { toast } from "sonner";

interface UseGridRetryProps {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
  
  /** Grid creation callback function */
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
 * @param props - Hook properties
 * @returns Retry-enhanced grid creation function
 */
export const useGridRetry = ({
  gridLayerRef,
  createGridCallback,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseGridRetryProps) => {
  // Track grid creation attempts
  const attemptCountRef = useRef<number>(0);
  const lastAttemptTimeRef = useRef<number>(0);
  const creationTimeoutRef = useRef<number | null>(null);
  
  /**
   * Create grid with retry logic
   * @param canvas - The Fabric.js canvas instance
   * @returns Array of created grid objects
   */
  const createGridWithRetry = useCallback((canvas: FabricCanvas): any[] => {
    // Throttle rapid creation attempts
    if (shouldThrottleGridCreation(lastAttemptTimeRef.current, DEFAULT_RETRY_CONFIG.minAttemptInterval)) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Throttling grid creation - too many rapid attempts");
      }
      
      // Clear any existing timeout
      if (creationTimeoutRef.current !== null) {
        clearTimeout(creationTimeoutRef.current);
      }
      
      // Even if throttled, schedule a retry after the throttle interval
      creationTimeoutRef.current = window.setTimeout(() => {
        if (!canvas) return;
        createGridWithRetry(canvas);
      }, DEFAULT_RETRY_CONFIG.minAttemptInterval + 200);
      
      return gridLayerRef.current;
    }
    
    // Update last attempt time
    lastAttemptTimeRef.current = Date.now();
    
    // Increment attempt counter
    attemptCountRef.current++;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Grid creation attempt #${attemptCountRef.current}`);
    }
    
    try {
      // Try to create the grid
      const grid = createGridCallback(canvas);
      
      if (grid && grid.length > 0) {
        // Reset attempt counter on success
        attemptCountRef.current = 0;
        return grid;
      } else if (attemptCountRef.current < DEFAULT_RETRY_CONFIG.maxAttempts) {
        // Schedule a retry with exponential backoff
        const timeoutId = scheduleGridRetry(canvas, attemptCountRef, createGridCallback, DEFAULT_RETRY_CONFIG);
        creationTimeoutRef.current = timeoutId;
      } else {
        // Handle max attempts reached with emergency grid
        return handleMaxAttemptsReached(
          canvas,
          gridLayerRef,
          setDebugInfo,
          setHasError,
          setErrorMessage
        );
      }
      
      return gridLayerRef.current;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Critical error in createGridWithRetry:", error);
      }
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try one more time with a delay before giving up
      if (attemptCountRef.current < DEFAULT_RETRY_CONFIG.maxAttempts) {
        // Clear any existing timeout
        if (creationTimeoutRef.current !== null) {
          clearTimeout(creationTimeoutRef.current);
        }
        
        creationTimeoutRef.current = window.setTimeout(() => {
          createGridWithRetry(canvas);
        }, 800);
      }
      
      return gridLayerRef.current;
    }
  }, [createGridCallback, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);
  
  /**
   * Clean up any pending timeouts
   */
  const cleanup = useCallback(() => {
    if (creationTimeoutRef.current !== null) {
      clearTimeout(creationTimeoutRef.current);
      creationTimeoutRef.current = null;
    }
  }, []);
  
  return {
    createGridWithRetry,
    cleanup
  };
};
