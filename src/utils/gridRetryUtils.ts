
/**
 * Grid retry utilities
 * Provides functions for handling grid creation retries
 * @module gridRetryUtils
 */
import { Canvas as FabricCanvas } from "fabric";
import { createBasicEmergencyGrid } from "./gridCreationUtils";
import { resetGridProgress } from "./gridManager";
import { toast } from "sonner";

/**
 * Default configuration for grid creation retries
 */
export const DEFAULT_RETRY_CONFIG = {
  /** Maximum number of retry attempts */
  maxAttempts: 3,
  
  /** Initial delay between retries in milliseconds */
  initialDelay: 400,  // Increased from 200 to 400ms
  
  /** Factor by which delay increases with each retry */
  backoffFactor: 2,
  
  /** Minimum interval between attempts in milliseconds */
  minAttemptInterval: 800  // Increased from 500ms to 800ms
};

/**
 * Schedule a grid creation retry with exponential backoff
 * 
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<number>} attemptCountRef - Reference to attempt counter
 * @param {Function} createGridCallback - The grid creation function
 * @param {Object} config - Retry configuration
 * @returns {number} Timeout ID for potential cancellation
 */
export const scheduleGridRetry = (
  canvas: FabricCanvas,
  attemptCountRef: React.MutableRefObject<number>,
  createGridCallback: (canvas: FabricCanvas) => any[],
  config = DEFAULT_RETRY_CONFIG
): number => {
  const attempt = attemptCountRef.current;
  
  // Only allow up to maxAttempts retries
  if (attempt >= config.maxAttempts) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Max grid creation attempts reached, using emergency grid");
    }
    return 0;
  }
  
  // Calculate delay with exponential backoff
  const delay = Math.min(
    config.initialDelay * Math.pow(config.backoffFactor, attempt - 1),
    3000 // Cap at 3 seconds max (increased from 2 seconds)
  );
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling grid retry #${attempt + 1} in ${delay}ms`);
  }
  
  // Schedule the retry
  return window.setTimeout(() => {
    if (!canvas) return;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Executing grid retry #${attempt + 1}`);
    }
    
    resetGridProgress();
    createGridCallback(canvas);
  }, delay);
};

/**
 * Handle reaching the maximum number of creation attempts
 * Creates a basic emergency grid as last resort
 * 
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to grid objects
 * @param {Function} setDebugInfo - Function to update debug info
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 * @returns {any[]} Emergency grid objects
 */
export const handleMaxAttemptsReached = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<any[]>,
  setDebugInfo: React.Dispatch<React.SetStateAction<any>>,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
): any[] => {
  if (process.env.NODE_ENV === 'development') {
    console.warn("Max grid creation attempts reached, using emergency grid");
  }
  
  // First notify the user that we're using a simplified grid
  toast.warning("Using simplified drawing grid due to creation difficulties.", {
    id: "emergency-grid",
    duration: 4000
  });
  
  try {
    // Create an emergency grid as last resort
    const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    if (emergencyGrid.length > 0) {
      // Emergency grid created successfully
      setDebugInfo(prev => ({...prev, gridCreated: true}));
      return emergencyGrid;
    } else {
      // Even emergency grid failed
      setHasError(true);
      setErrorMessage("Failed to create grid after multiple attempts.");
      
      toast.error("Unable to create drawing grid. Please refresh the page.", {
        id: "grid-error",
        duration: 7000
      });
      return [];
    }
  } catch (error) {
    // Critical failure
    setHasError(true);
    setErrorMessage(`Grid creation failed completely: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};
