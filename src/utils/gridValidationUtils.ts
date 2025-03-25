
/**
 * Grid validation utilities
 * Provides functions for validating grid components and throttling creation
 * @module gridValidationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "./logger";

/**
 * Validates canvas and grid components before creation
 * Ensures all required components are available and valid
 * 
 * @param {FabricCanvas} canvas - The canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to grid layer
 * @returns {Object} Validation result with status and message
 */
export const validateGridComponents = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]> | null
): { valid: boolean; message?: string } => {
  if (!canvas) {
    return { valid: false, message: "Canvas is null" };
  }
  
  if (!gridLayerRef) {
    return { valid: false, message: "Grid layer reference is null" };
  }
  
  return { valid: true };
};

/**
 * Ensures grid layer reference is initialized
 * 
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to grid layer
 */
export const ensureGridLayerInitialized = (
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!gridLayerRef.current) {
    gridLayerRef.current = [];
  }
};

/**
 * Determines if grid creation should be throttled based on timing
 * Prevents too many rapid creation attempts
 * 
 * @param {number} lastAttemptTime - Timestamp of last attempt
 * @param {number} minInterval - Minimum time between attempts in ms
 * @returns {boolean} Whether creation should be throttled
 */
export const shouldThrottleGridCreation = (
  lastAttemptTime: number,
  minInterval: number
): boolean => {
  const now = Date.now();
  return now - lastAttemptTime < minInterval;
};

/**
 * Checks if two grid layouts are essentially the same
 * Used to prevent unnecessary grid recreation
 * 
 * @param {Object} oldDimensions - Old canvas dimensions
 * @param {Object} newDimensions - New canvas dimensions
 * @param {number} changeTolerance - Tolerance percentage (0-1)
 * @returns {boolean} Whether dimensions are similar enough
 */
export const areGridLayoutsSimilar = (
  oldDimensions: { width: number; height: number },
  newDimensions: { width: number; height: number },
  changeTolerance: number = 0.15
): boolean => {
  if (oldDimensions.width === 0 || oldDimensions.height === 0) {
    return false;
  }
  
  const widthChange = Math.abs(oldDimensions.width - newDimensions.width) / oldDimensions.width;
  const heightChange = Math.abs(oldDimensions.height - newDimensions.height) / oldDimensions.height;
  
  return widthChange <= changeTolerance && heightChange <= changeTolerance;
};

/**
 * Creates a minimal grid structure when normal creation fails
 * Used as a last resort for basic functionality
 * 
 * @param {FabricCanvas} canvas - The canvas instance
 * @returns {boolean} Success indicator
 */
export const createMinimalGridStructure = (canvas: FabricCanvas): boolean => {
  try {
    // Create a minimal background and guides
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Set background color
    canvas.backgroundColor = '#fcfcfd';
    
    return true;
  } catch (error) {
    logger.error("Error creating minimal grid structure:", error);
    return false;
  }
};
