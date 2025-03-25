
/**
 * Grid validation utilities
 * Handles validation and throttling for grid creation
 * @module gridValidationUtils
 */
import { Canvas as FabricCanvas } from "fabric";

/**
 * Validate canvas and gridLayerRef before grid creation
 * 
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to the grid layer objects
 * @returns Whether validation passed
 */
export const validateGridComponents = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<any[]> | undefined
): { valid: boolean, message?: string } => {
  // Basic validation
  if (!canvas) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Canvas is null in grid validation");
    }
    return { valid: false, message: "Canvas is null" };
  }
  
  // Safety check for gridLayerRef
  if (!gridLayerRef || !gridLayerRef.current) {
    if (process.env.NODE_ENV === 'development') {
      console.error("gridLayerRef is null or undefined in grid validation");
    }
    
    // Valid but with warning
    return { 
      valid: true, 
      message: "gridLayerRef is null or undefined, will be initialized"
    };
  }
  
  return { valid: true };
};

/**
 * Check if grid creation should be throttled
 * 
 * @param lastAttemptTime - Timestamp of the last attempt
 * @param minInterval - Minimum interval between attempts in ms
 * @returns Whether creation should be throttled
 */
export const shouldThrottleGridCreation = (
  lastAttemptTime: number,
  minInterval: number
): boolean => {
  const now = Date.now();
  return now - lastAttemptTime < minInterval;
};

/**
 * Initialize gridLayerRef if needed
 * 
 * @param gridLayerRef - Reference to grid layer objects
 */
export const ensureGridLayerInitialized = (
  gridLayerRef: React.MutableRefObject<any[]> | undefined
): void => {
  if (gridLayerRef && !gridLayerRef.current) {
    gridLayerRef.current = [];
  }
};
