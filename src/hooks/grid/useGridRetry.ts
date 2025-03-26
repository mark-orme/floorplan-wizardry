
/**
 * Hook for managing grid creation retries
 * Provides automatic retry functionality with backoff
 * @module useGridRetry
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils"; 
import { DebugInfoState } from "@/types/drawingTypes";
import logger from "@/utils/logger";

// Refined retry configuration
const RETRY_CONFIG = {
  MAX_ATTEMPTS: 5,          // Increased from 3 to 5
  BASE_DELAY: 300,          // Adjusted base delay
  MAX_DELAY: 2000,          // Maximum delay between retries
  BACKOFF_FACTOR: 1.5       // Exponential backoff factor
};

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
   * Calculate delay for the next retry with exponential backoff
   */
  const calculateRetryDelay = useCallback((attempt: number): number => {
    return Math.min(
      RETRY_CONFIG.BASE_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_FACTOR, attempt),
      RETRY_CONFIG.MAX_DELAY
    );
  }, []);
  
  /**
   * Schedule next retry with exponential backoff
   */
  const scheduleRetry = useCallback((canvas: FabricCanvas): number | null => {
    if (!canvas) return null;
    
    const currentAttempt = attemptCountRef.current;
    if (currentAttempt >= RETRY_CONFIG.MAX_ATTEMPTS) {
      logger.warn(`Max grid creation attempts (${RETRY_CONFIG.MAX_ATTEMPTS}) reached`);
      return null;
    }
    
    const delay = calculateRetryDelay(currentAttempt);
    logger.info(`Scheduling grid retry attempt #${currentAttempt + 1} in ${delay}ms`);
    
    return window.setTimeout(() => {
      logger.info(`Executing grid retry #${currentAttempt + 1}`);
      attemptCountRef.current += 1;
      try {
        createGridCallback(canvas);
      } catch (error) {
        logger.error("Error during grid retry:", error);
      }
    }, delay);
  }, [calculateRetryDelay, createGridCallback]);
  
  /**
   * Create grid with retry capability
   * @param canvas - The Fabric.js canvas instance
   * @returns Created grid objects
   */
  const createGridWithRetry = useCallback((canvas: FabricCanvas): any[] => {
    logger.info(`Grid creation attempt #${attemptCountRef.current + 1}/${RETRY_CONFIG.MAX_ATTEMPTS}`);
    
    // Clear any existing retry timeout
    if (retryTimeoutRef.current !== null) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // If we've exceeded max attempts, create emergency grid
    if (attemptCountRef.current >= RETRY_CONFIG.MAX_ATTEMPTS) {
      logger.warn(`Max attempts (${RETRY_CONFIG.MAX_ATTEMPTS}) reached, using emergency grid`);
      
      try {
        // Create emergency grid directly
        const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
        setDebugInfo(prev => ({...prev, gridCreated: true, isEmergencyGrid: true}));
        return emergencyGrid;
      } catch (error) {
        logger.error("Failed to create emergency grid:", error);
        setHasError(true);
        setErrorMessage("Failed to create drawing grid. Please try refreshing.");
        return [];
      }
    }
    
    // Try to create the grid normally
    try {
      const grid = createGridCallback(canvas);
      
      // If grid creation succeeded, reset attempt counter
      if (grid && grid.length > 0) {
        logger.info(`Grid created successfully with ${grid.length} objects`);
        attemptCountRef.current = 0;
        return grid;
      }
      
      // Schedule retry if creation returned empty grid
      retryTimeoutRef.current = scheduleRetry(canvas);
      return gridLayerRef.current;
    } catch (error) {
      logger.error("Error in grid creation:", error);
      
      // Schedule retry on error
      retryTimeoutRef.current = scheduleRetry(canvas);
      return gridLayerRef.current;
    }
  }, [
    createGridCallback, 
    gridLayerRef, 
    scheduleRetry, 
    setDebugInfo, 
    setHasError, 
    setErrorMessage
  ]);
  
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
    cleanup,
    retryConfig: RETRY_CONFIG
  };
};
