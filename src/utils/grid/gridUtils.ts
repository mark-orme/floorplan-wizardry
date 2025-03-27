
/**
 * Grid utility functions
 * @module grid/gridUtils
 */
import { Canvas, Object as FabricObject } from "fabric";

/**
 * Check if grid exists on canvas
 * @param canvas - The fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @returns Whether grid exists
 */
export const doesGridExist = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Check if we have grid objects
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if they're on the canvas
  let gridObjectsOnCanvas = 0;
  
  gridLayerRef.current.forEach(obj => {
    if (canvas.contains(obj)) {
      gridObjectsOnCanvas++;
    }
  });
  
  // Return true if at least 50% of grid objects are on canvas
  return gridObjectsOnCanvas > gridLayerRef.current.length / 2;
};

/**
 * Create empty grid wrapper
 * For when normal grid creation fails but we need a valid return value
 * @returns Empty array of fabric objects
 */
export const createEmptyGrid = (): FabricObject[] => {
  return [];
};

/**
 * Ensure grid layer is initialized
 * @param gridLayerRef - Reference to grid layer
 * @returns Whether grid layer is initialized
 */
export const ensureGridLayer = (
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Initialize grid layer if it's null or undefined
  if (!gridLayerRef.current) {
    gridLayerRef.current = [];
  }
  
  return true;
};

/**
 * Add grid objects to canvas
 * @param canvas - The fabric canvas
 * @param gridObjects - Grid objects to add
 * @returns Success status
 */
export const addGridToCanvas = (
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects.length) {
    return false;
  }
  
  try {
    // Add all grid objects to canvas
    gridObjects.forEach(obj => {
      if (!canvas.contains(obj)) {
        canvas.add(obj);
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error adding grid to canvas:", error);
    return false;
  }
};
