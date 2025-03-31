
/**
 * Grid creation core utilities
 * @module utils/grid/gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from './gridBasics';
import { createCompleteGrid } from './gridRenderers';
import { retryWithBackoff } from './gridRetryUtils';

/**
 * Ensure grid is created
 * @param canvas Fabric canvas
 * @param gridLayerRef Reference to grid objects
 * @returns Newly created or existing grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid exists and is on canvas
  if (gridLayerRef.current.length > 0) {
    const objectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj));
    if (objectsOnCanvas.length === gridLayerRef.current.length) {
      return gridLayerRef.current;
    }
  }
  
  // Clear any existing grid
  if (gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
  }
  
  // Create new grid
  const gridObjects = createCompleteGrid(canvas);
  gridLayerRef.current = gridObjects;
  
  return gridObjects;
};

/**
 * Reorder grid objects to be at the back of canvas
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Move all grid objects to the back
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error reordering grid objects:", error);
  }
};

/**
 * Validate grid existence and integrity
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects to validate
 * @returns Whether grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  
  // Check if grid objects exist
  if (!gridObjects || gridObjects.length === 0) return false;
  
  // Check if grid objects are on canvas
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return objectsOnCanvas.length > 0;
};

/**
 * Verify that grid exists
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects reference
 * @returns Whether grid exists
 */
export const verifyGridExists = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  if (!gridObjects || gridObjects.length === 0) return false;
  
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return objectsOnCanvas.length > 0;
};

// Re-export for compatibility
export { retryWithBackoff } from './gridRetryUtils';
export { createBasicEmergencyGrid, createCompleteGrid } from './gridRenderers';
