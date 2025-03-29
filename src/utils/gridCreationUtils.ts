
/**
 * Grid creation utilities
 * Simple utilities for creating and validating grid
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import { 
  createGridLayer, 
  createFallbackGrid
} from "./grid/gridCreation";
import { validateCanvas } from "./grid/gridValidation";
import { throttledLog } from "./grid/consoleThrottling";

/**
 * Create a complete grid with both small and large scale lines
 * Wrapper for gridCreation.createGridLayer
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export function createCompleteGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  if (!validateCanvas(canvas)) {
    throw new Error("Invalid canvas for grid creation");
  }
  
  throttledLog("Creating complete grid");
  return createGridLayer(canvas, gridLayerRef);
}

/**
 * Create a basic emergency grid
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export function createBasicEmergencyGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  if (!validateCanvas(canvas)) {
    throw new Error("Invalid canvas for emergency grid creation");
  }
  
  throttledLog("Creating basic emergency grid");
  return createFallbackGrid(canvas, gridLayerRef);
}

/**
 * Validate that grid exists on canvas
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {boolean} Whether grid is valid
 */
export function validateGrid(
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean {
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  // Simple validation - check if grid objects exist
  if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
    return false;
  }
  
  // Check if at least some grid objects are on canvas
  let foundOnCanvas = false;
  
  for (const obj of gridObjects) {
    if (canvas.contains(obj)) {
      foundOnCanvas = true;
      break;
    }
  }
  
  return foundOnCanvas;
}

/**
 * Verify if grid exists and is valid on the canvas
 * 
 * @param {Canvas | null} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid exists and is valid
 */
export function verifyGridExists(
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean {
  if (!canvas) return false;
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) return false;
  
  // Check if at least some grid objects are on canvas
  let foundOnCanvas = false;
  for (const obj of gridLayerRef.current) {
    if (canvas.contains(obj)) {
      foundOnCanvas = true;
      break;
    }
  }
  
  return foundOnCanvas;
}

/**
 * Reorder grid objects for proper rendering
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export function reorderGridObjects(
  canvas: Canvas,
  gridObjects: FabricObject[]
): void {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return;
  }
  
  // Send grid objects to back
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendObjectToBack(obj);
    }
  });
}

/**
 * Retry a function with exponential backoff
 * 
 * @param {Function} operation - Function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<any>} Result of the operation
 */
export async function retryWithBackoff<T>(
  operation: () => T | Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 100
): Promise<T> {
  let attempt = 1;
  const execute = async (): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
      return execute();
    }
  };
  
  return execute();
}

/**
 * Ensure grid exists on canvas, creating it if needed
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid was ensured successfully
 */
export function ensureGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean {
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  // Check if grid already exists
  if (validateGrid(canvas, gridLayerRef.current)) {
    return true;
  }
  
  // Grid doesn't exist or is invalid, create it
  try {
    createCompleteGrid(canvas, gridLayerRef);
    return true;
  } catch (error) {
    console.error("Error ensuring grid:", error);
    
    // Try emergency grid as fallback
    try {
      createBasicEmergencyGrid(canvas, gridLayerRef);
      return true;
    } catch (fallbackError) {
      console.error("Fallback grid creation also failed:", fallbackError);
      return false;
    }
  }
}
