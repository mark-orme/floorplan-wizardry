
/**
 * Grid creation utilities
 * Provides utilities for creating and managing grids
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Line, Rect, Object as FabricObject, fabric } from "fabric";
import logger from "./logger";
import { createSimpleGrid } from "./simpleGridCreator";

/**
 * Create a basic emergency grid when all else fails
 * Minimal grid for basic functionality
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    console.log("📊 Creating basic emergency grid");
    
    // Clear existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    return createSimpleGrid(canvas, []);
  } catch (error) {
    console.error("❌ Error creating emergency grid:", error);
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a floor plan grid
 * Specific grid for floor plan applications
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {FabricObject[]} existingGrid - Existing grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createFloorPlanGrid = (
  canvas: FabricCanvas,
  existingGrid: FabricObject[] = []
): FabricObject[] => {
  return createSimpleGrid(canvas, existingGrid);
};

/**
 * Validate if canvas has a complete grid
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} Whether grid is complete
 */
export const hasCompleteGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  // No grid objects means no grid
  if (!gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  // Check if all grid objects are on canvas
  const onCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  
  // If less than 90% of grid objects are on canvas, grid is incomplete
  return onCanvas >= gridObjects.length * 0.9;
};

/**
 * Force grid to render even when canvas is problematic
 * @param {FabricCanvas} canvas - Canvas for grid
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const forceGridRender = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  try {
    // Clear canvas rendering queue
    canvas.clearContext(canvas.getContext());
    
    // Remove all existing objects
    canvas.clear();
    
    // Reset grid ref
    gridLayerRef.current = [];
    
    // Create emergency grid
    createBasicEmergencyGrid(canvas, gridLayerRef);
    
    // Force render
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Failed to force grid render:", error);
  }
};

/* Add exports required by other modules */

/**
 * Verify if grid exists and is valid
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid exists
 */
export const verifyGridExists = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if grid objects are on canvas
  const validObjects = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
  return validObjects > 0;
};

/**
 * Create a complete grid with all elements
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating complete grid");
  return createSimpleGrid(canvas, []);
};

/**
 * Ensure grid exists, creating it if necessary
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (verifyGridExists(canvas, gridLayerRef)) {
    return gridLayerRef.current;
  }
  return createCompleteGrid(canvas, gridLayerRef);
};

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - Operation to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {Promise<any>} Operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => T | Promise<T>,
  maxAttempts: number = 3
): Promise<T> => {
  let attempt = 1;
  
  const retry = async (): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 100;
      console.log(`Retry attempt ${attempt} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
      
      return retry();
    }
  };
  
  return retry();
};

/**
 * Reorder grid objects for proper rendering
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return;
  }
  
  // Send all grid objects to back
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendToBack(obj);
    }
  });
};

/**
 * Validate grid existence and structure
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  return verifyGridExists(canvas, gridLayerRef);
};

/**
 * Create a grid layer of specified type
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {string} type - Type of grid layer
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridLayer = (
  canvas: FabricCanvas,
  type: string = 'default'
): FabricObject[] => {
  return createSimpleGrid(canvas, []);
};

/**
 * Create a fallback grid with minimal functionality
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createFallbackGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  return createBasicEmergencyGrid(canvas, gridLayerRef);
};

// Export snap functions explicitly
export { snapPointToGrid } from './simpleGridCreator';
