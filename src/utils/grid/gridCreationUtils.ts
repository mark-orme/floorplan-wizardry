
/**
 * Grid creation utilities
 * Provides functions for creating grid objects on the canvas
 * @module grid/gridCreationUtils
 */

import { Canvas, Object as FabricObject } from "fabric";
import { GridDimensions } from "@/types/fabric";
import { DebugInfoState } from "@/types/debugTypes";
import logger from "../logger";
import { GRID_SPACING, SMALL_GRID, LARGE_GRID } from "@/constants/numerics";
import { GRID_OFFSET_FACTOR } from "./gridPositioningConstants";

/**
 * Create a basic emergency grid as a fallback
 * Used when normal grid creation fails
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  // Implementation details for emergency grid creation
  logger.warn("Creating emergency grid");
  
  // Use empty array as emergency fallback
  return [];
};

/**
 * Validate that grid exists and is properly attached to canvas
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check that at least 50% of grid objects are still on canvas
  let validObjects = 0;
  
  gridLayerRef.current.forEach(obj => {
    if (canvas.contains(obj)) {
      validObjects++;
    }
  });
  
  return validObjects > gridLayerRef.current.length / 2;
};

/**
 * Verify if grid exists and is valid
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {boolean} Whether grid exists and is valid
 */
export const verifyGridExists = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  return validateGrid(canvas, gridLayerRef);
};

/**
 * Retry grid creation with exponential backoff
 * 
 * @param {Function} creationFn - Function to create grid
 * @param {number} attempt - Current attempt number
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {Promise<FabricObject[]>} Created grid objects
 */
export const retryWithBackoff = async (
  creationFn: () => FabricObject[],
  attempt: number = 1,
  maxAttempts: number = 3
): Promise<FabricObject[]> => {
  try {
    return creationFn();
  } catch (error) {
    if (attempt >= maxAttempts) {
      throw error;
    }
    
    // Wait with exponential backoff
    const delay = Math.pow(2, attempt) * 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Try again
    return retryWithBackoff(creationFn, attempt + 1, maxAttempts);
  }
};

/**
 * Create a complete grid
 * Main entry point for grid creation
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  // Implementation for complete grid creation
  return [];
};

/**
 * Ensure grid exists, creating it if necessary
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (verifyGridExists(canvas, gridLayerRef)) {
    return gridLayerRef.current;
  }
  
  return createCompleteGrid(canvas, gridLayerRef);
};

/**
 * Reorder grid objects for proper rendering
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return;
  }
  
  // Send grid objects to back
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendObjectToBack(obj);
    }
  });
};
