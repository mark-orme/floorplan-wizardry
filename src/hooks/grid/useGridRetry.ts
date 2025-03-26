
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
import { toast } from "sonner";

// Refined retry configuration
const RETRY_CONFIG = {
  MAX_ATTEMPTS: 5,          // Maximum number of attempts
  BASE_DELAY: 300,          // Base delay in ms
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
  
  // Flag to prevent multiple concurrent retry operations
  const isRetryingRef = useRef<boolean>(false);
  
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
    
    // Prevent scheduling multiple retries
    if (isRetryingRef.current) {
      logger.warn("A retry is already scheduled, skipping");
      return null;
    }
    
    // Check if already at max attempts
    const currentAttempt = attemptCountRef.current;
    if (currentAttempt >= RETRY_CONFIG.MAX_ATTEMPTS) {
      logger.warn(`Max grid creation attempts (${RETRY_CONFIG.MAX_ATTEMPTS}) reached`);
      return null;
    }
    
    isRetryingRef.current = true;
    
    const delay = calculateRetryDelay(currentAttempt);
    logger.info(`Scheduling grid retry attempt #${currentAttempt + 1} in ${delay}ms`);
    
    return window.setTimeout(() => {
      logger.info(`Executing grid retry #${currentAttempt + 1}`);
      attemptCountRef.current += 1;
      
      try {
        // Check that canvas is still valid
        if (canvas) {
          // Try to create grid with original callback
          const gridObjects = createGridCallback(canvas);
          
          // Log the result for debugging
          console.log(`Grid retry #${currentAttempt + 1} result: ${gridObjects.length} objects`);
          
          // If we still have no grid, try a more aggressive approach on the last attempt
          if (gridObjects.length === 0 && currentAttempt >= RETRY_CONFIG.MAX_ATTEMPTS - 1) {
            console.log("Final retry with no objects, forcing simple grid creation");
            setTimeout(() => {
              createBasicEmergencyGrid(canvas, gridLayerRef); 
            }, 100);
          }
        }
      } catch (error) {
        logger.error("Error during grid retry:", error);
      } finally {
        isRetryingRef.current = false;
      }
    }, delay);
  }, [calculateRetryDelay, createGridCallback, gridLayerRef]);
  
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
        // Display a toast notification to inform the user
        toast.warning("Using simplified grid due to initialization issues", {
          id: "emergency-grid-toast",
          duration: 3000
        });
        
        // Create emergency grid directly - with additional logging
        console.log("Creating emergency grid due to max retries");
        const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
        
        console.log(`Emergency grid created with ${emergencyGrid.length} elements`);
        
        // Update debug info regardless of success
        setDebugInfo(prev => ({
          ...prev, 
          gridCreated: true, 
          isEmergencyGrid: true,
          gridObjectCount: emergencyGrid.length
        }));
        
        // Force render to ensure grid is visible
        if (canvas) {
          canvas.requestRenderAll();
        }
        
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
      // Check if canvas is valid before proceeding
      if (!canvas) {
        logger.warn("Canvas is null, skipping grid creation");
        return gridLayerRef.current;
      }
      
      const grid = createGridCallback(canvas);
      
      // If grid creation succeeded, reset attempt counter
      if (grid && grid.length > 0) {
        logger.info(`Grid created successfully with ${grid.length} objects`);
        attemptCountRef.current = 0;
        isRetryingRef.current = false;
        
        // Force a render to ensure grid is visible
        canvas.requestRenderAll();
        return grid;
      }
      
      // If grid is empty, create emergency grid directly on last attempt
      if (attemptCountRef.current >= RETRY_CONFIG.MAX_ATTEMPTS - 1) {
        console.log("Last attempt with no grid, forcing emergency grid creation");
        setTimeout(() => createBasicEmergencyGrid(canvas, gridLayerRef), 50);
      }
      
      // Schedule retry if creation returned empty grid
      retryTimeoutRef.current = scheduleRetry(canvas);
      return gridLayerRef.current;
    } catch (error) {
      logger.error("Error in grid creation:", error);
      
      // On last attempt, try emergency grid regardless of error
      if (attemptCountRef.current >= RETRY_CONFIG.MAX_ATTEMPTS - 1) {
        console.log("Error on last attempt, forcing emergency grid creation");
        setTimeout(() => createBasicEmergencyGrid(canvas, gridLayerRef), 50);
      }
      
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
    isRetryingRef.current = false;
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
