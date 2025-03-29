
/**
 * Grid creation utilities
 * Provides fallback and emergency grid creation functions
 * @module utils/gridCreationUtils
 */
import { Canvas, Line, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Creates a basic emergency grid when normal grid creation fails
 * Simplified version that prioritizes reliability over features
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    console.log("Creating emergency grid");
    
    // Safety checks
    if (!canvas) {
      return [];
    }
    
    // Get canvas dimensions
    const width = canvas.getWidth ? canvas.getWidth() : canvas.width;
    const height = canvas.getHeight ? canvas.getHeight() : canvas.height;
    
    if (!width || !height) {
      console.error("Canvas dimensions unavailable");
      return [];
    }
    
    // Clear any existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    const gridSize = 50; // Larger, more reliable grid size
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: 'rgba(200, 200, 200, 0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
        metadata: { type: "grid", gridType: "emergency" }
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: 'rgba(200, 200, 200, 0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
        metadata: { type: "grid", gridType: "emergency" }
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update grid reference
    gridLayerRef.current = gridObjects;
    
    // Force render to ensure grid is visible
    canvas.requestRenderAll();
    
    console.log(`Created emergency grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    logger.error("Emergency grid creation failed:", error);
    return [];
  }
};

/**
 * Verify if grid exists on canvas
 * @param {Canvas} canvas - The fabric canvas
 * @param {FabricObject[]} gridObjects - Current grid objects
 * @returns {boolean} Whether grid exists
 */
export const verifyGridExists = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  // Check if at least some grid objects are on the canvas
  let objectsOnCanvas = 0;
  for (let i = 0; i < Math.min(gridObjects.length, 10); i++) {
    if (canvas.contains(gridObjects[i])) {
      objectsOnCanvas++;
    }
  }
  
  return objectsOnCanvas > 0;
};

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<any>} Result of the operation
 */
export const retryWithBackoff = async (
  operation: () => any,
  maxRetries = 3
): Promise<any> => {
  let attempt = 0;
  
  const execute = async (): Promise<any> => {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 100ms, 200ms, 400ms, etc.
      const delay = 100 * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return execute();
    }
  };
  
  return execute();
};

/**
 * Reorder grid objects for proper z-index
 * @param {Canvas} canvas - The fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 * @returns {boolean} Success status
 */
export const reorderGridObjects = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  try {
    // Send all grid objects to back
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    // Force render
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    logger.error("Error reordering grid objects:", error);
    return false;
  }
};

/**
 * Ensure grid exists and is visible on canvas
 * Creates emergency grid if needed
 * @param {Canvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Grid objects reference
 * @returns {boolean} Success status
 */
export const ensureGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    return false;
  }
  
  // Check if grid exists
  if (!verifyGridExists(canvas, gridLayerRef.current)) {
    // Create emergency grid
    createBasicEmergencyGrid(canvas, gridLayerRef);
  }
  
  // Reorder grid objects
  return reorderGridObjects(canvas, gridLayerRef.current);
};

// Export createCompleteGrid for convenient access
export { createCompleteGrid } from "@/utils/grid/gridCreation";
