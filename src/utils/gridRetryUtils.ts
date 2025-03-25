
/**
 * Grid creation retry utilities
 * Handles retry logic for grid creation attempts
 * @module gridRetryUtils
 */
import { Canvas as FabricCanvas } from "fabric";
import { resetGridProgress } from "./gridManager";
import { createBasicEmergencyGrid } from "./emergencyGridUtils";

/**
 * Configuration for grid creation retries
 */
export interface GridRetryConfig {
  maxAttempts: number;
  minAttemptInterval: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: GridRetryConfig = {
  maxAttempts: 7,
  minAttemptInterval: 150
};

/**
 * Schedule a retry for grid creation with exponential backoff
 * 
 * @param canvas - The Fabric canvas instance
 * @param attemptCountRef - Reference to the current attempt count
 * @param createGridCallback - Function to create the grid
 * @param config - Retry configuration
 */
export const scheduleGridRetry = (
  canvas: FabricCanvas | null,
  attemptCountRef: React.MutableRefObject<number>,
  createGridCallback: (canvas: FabricCanvas) => any[],
  config: GridRetryConfig = DEFAULT_RETRY_CONFIG
): void => {
  if (!canvas) return;
  
  // Calculate delay with exponential backoff
  const delay = Math.min(100 * Math.pow(1.5, attemptCountRef.current), 2000);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling grid creation retry in ${delay}ms (attempt ${attemptCountRef.current}/${config.maxAttempts})`);
  }
  
  setTimeout(() => {
    if (!canvas) return;
    resetGridProgress();
    createGridCallback(canvas);
  }, delay);
};

/**
 * Create emergency grid if all normal attempts fail
 * 
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to the grid layer objects
 * @param setDebugInfo - Function to update debug info
 * @param setHasError - Function to set error state
 * @param setErrorMessage - Function to set error message
 * @returns The created emergency grid objects
 */
export const handleMaxAttemptsReached = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<any[]>,
  setDebugInfo?: React.Dispatch<React.SetStateAction<any>>,
  setHasError?: (value: boolean) => void,
  setErrorMessage?: (value: string) => void
): any[] => {
  if (process.env.NODE_ENV === 'development') {
    console.warn("Reached maximum grid creation attempts");
  }
  
  // Additional fallback: Create basic emergency grid
  const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
  if (emergencyGrid.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Created emergency basic grid");
    }
    if (setDebugInfo) {
      setDebugInfo(prev => ({...prev, gridCreated: true}));
    }
    return emergencyGrid;
  }
  
  if (setHasError && setErrorMessage) {
    setHasError(true);
    setErrorMessage("Failed to create grid after maximum attempts");
  }
  
  return [];
};
