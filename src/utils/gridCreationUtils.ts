
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

/**
 * Create a basic emergency grid with minimal features
 * Used as a fallback when standard grid creation fails
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) return [];
  
  console.log("Creating emergency grid...");
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create only the large grid lines to reduce overhead
  for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([i, 0, i, height], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
    const line = new Line([0, i, width, i], {
      stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Store grid objects in ref if provided
  if (gridLayerRef) {
    gridLayerRef.current = gridObjects;
  }
  
  canvas.requestRenderAll();
  return gridObjects;
};

/**
 * Verify if a grid exists on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {boolean} Whether a grid exists
 */
export const verifyGridExists = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const objects = canvas.getObjects();
  return objects.some(obj => obj.objectType === 'grid');
};

/**
 * Create a complete grid with all elements
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (canvas: FabricCanvas): FabricObject[] => {
  // For now, we're just using the basic implementation
  return createBasicEmergencyGrid(canvas);
};

/**
 * Ensure grid exists, creating it if needed
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  if (verifyGridExists(canvas)) {
    return canvas.getObjects().filter(obj => obj.objectType === 'grid');
  }
  
  return createBasicEmergencyGrid(canvas);
};

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - Function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @returns {Promise<any>} Operation result
 */
export const retryWithBackoff = async (
  operation: () => any,
  maxAttempts: number = 3
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Calculate backoff time
      const backoffTime = Math.pow(2, attempt) * 100;
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  throw lastError;
};

/**
 * Reorder grid objects to be drawn first
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {void}
 */
export const reorderGridObjects = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  const objects = canvas.getObjects();
  const gridObjects = objects.filter(obj => obj.objectType === 'grid');
  const nonGridObjects = objects.filter(obj => obj.objectType !== 'grid');
  
  // Clear canvas
  canvas.clear();
  
  // Add grid objects first
  gridObjects.forEach(obj => {
    canvas.add(obj);
  });
  
  // Add non-grid objects
  nonGridObjects.forEach(obj => {
    canvas.add(obj);
  });
  
  canvas.requestRenderAll();
};

/**
 * Create a grid layer for the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Grid objects
 */
export const createGridLayer = (canvas: FabricCanvas): FabricObject[] => {
  return createBasicEmergencyGrid(canvas);
};

/**
 * Create a fallback grid when main grid creation fails
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Grid objects
 */
export const createFallbackGrid = (canvas: FabricCanvas): FabricObject[] => {
  return createBasicEmergencyGrid(canvas);
};

/**
 * Check if canvas has a complete grid
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {boolean} Whether grid is complete
 */
export const hasCompleteGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const gridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
  return gridObjects.length >= 8; // Minimum count for a basic grid
};

/**
 * Force grid render if it's not visible
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {boolean} Whether render was forced
 */
export const forceGridRender = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  canvas.requestRenderAll();
  return true;
};

/**
 * Validate that a grid is properly rendered
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (canvas: FabricCanvas): boolean => {
  return verifyGridExists(canvas);
};
