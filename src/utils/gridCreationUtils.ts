
/**
 * Grid creation helper utilities
 * Provides functions for grid creation and management
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid, forceCreateGrid } from "./grid/gridDebugUtils";

/**
 * Verify if grid exists on canvas
 * 
 * @param {Canvas | null} canvas - The canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether the grid exists on canvas
 */
export const verifyGridExists = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    return false;
  }
  
  const gridObjects = gridLayerRef.current;
  
  if (!gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  // Check if all grid objects are on canvas
  return gridObjects.every(obj => canvas.contains(obj));
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
  // Implementation for complete grid creation that uses gridCreation.ts functions
  // This is a placeholder implementation that will be replaced with actual grid creation logic
  console.log("Creating grid - placeholder implementation");
  
  // Create a basic emergency grid as temporary implementation
  return createBasicEmergencyGrid(canvas, gridLayerRef);
};

/**
 * Ensure grid exists, creating it if necessary
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {boolean} Whether grid exists and was checked/created successfully
 */
export const ensureGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (verifyGridExists(canvas, gridLayerRef)) {
    return true;
  }
  
  try {
    createCompleteGrid(canvas, gridLayerRef);
    return gridLayerRef.current.length > 0;
  } catch (error) {
    console.error("Error ensuring grid exists:", error);
    return false;
  }
};

/**
 * Retry an operation with exponential backoff
 * 
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<any>} Promise resolving to the operation result
 */
export const retryWithBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  initialDelay: number = 100
): Promise<any> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we get here, all retries failed
  throw lastError || new Error("Operation failed after max retries");
};

/**
 * Reorder grid objects to ensure they're at the back of the canvas
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects to reorder
 * @returns {FabricObject[]} The reordered grid objects
 */
export const reorderGridObjects = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): FabricObject[] => {
  // Send all grid objects to the back
  gridObjects.forEach(obj => {
    canvas.sendObjectToBack(obj);
  });
  
  return gridObjects;
};

// Re-export functions from gridDebugUtils to maintain compatibility
export { createBasicEmergencyGrid, forceCreateGrid };
