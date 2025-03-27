
/**
 * Grid debug utilities
 * Functions for debugging and recovery of grid
 * @module grid/gridDebugUtils
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { createBasicEmergencyGrid } from '../gridCreationUtils';

/**
 * Dump grid state to console for debugging
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const dumpGridState = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas) {
    console.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  try {
    const canvasObjects = canvas.getObjects();
    const gridObjects = gridLayerRef.current;
    
    // Log grid state information
    console.log("GRID DEBUG STATE:", {
      canvasDimensions: {
        width: canvas.width,
        height: canvas.height
      },
      totalObjectsOnCanvas: canvasObjects.length,
      gridObjectsInRef: gridObjects.length,
      gridObjectsOnCanvas: gridObjects.filter(obj => canvas.contains(obj)).length,
      gridObjectTypes: gridObjects
        .map(obj => obj.type)
        .reduce((acc, type) => ({
          ...acc,
          [type]: (acc[type] || 0) + 1
        }), {} as Record<string, number>)
    });
  } catch (error) {
    console.error("Error dumping grid state:", error);
  }
};

/**
 * Attempt to recover grid if it's missing or detached
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {(canvas: Canvas) => FabricObject[] | null} createGridFn - Optional custom grid creation function
 * @returns {boolean} Success status
 */
export const attemptGridRecovery = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn: ((canvas: Canvas) => FabricObject[]) | null
): boolean => {
  try {
    const gridObjectsInRef = gridLayerRef.current;
    
    // Check if we have grid objects in reference but not on canvas
    if (gridObjectsInRef.length > 0) {
      const gridObjectsOnCanvas = gridObjectsInRef.filter(obj => canvas.contains(obj));
      
      // If some grid objects are missing from canvas, try to re-add them
      if (gridObjectsOnCanvas.length < gridObjectsInRef.length) {
        console.log("Attempting to re-add missing grid objects to canvas");
        
        gridObjectsInRef.forEach(obj => {
          if (!canvas.contains(obj)) {
            try {
              canvas.add(obj);
            } catch (error) {
              console.error("Error re-adding grid object:", error);
            }
          }
        });
        
        canvas.renderAll();
        
        // Verify the recovery worked
        const verifiedObjectsOnCanvas = gridObjectsInRef.filter(obj => canvas.contains(obj));
        
        if (verifiedObjectsOnCanvas.length > gridObjectsOnCanvas.length) {
          console.log(`Grid recovery partial success: ${verifiedObjectsOnCanvas.length}/${gridObjectsInRef.length} objects now on canvas`);
          return true;
        }
      }
    }
    
    // If we have a custom grid creation function, use it first
    if (createGridFn) {
      console.log("Attempting grid recovery with custom creation function");
      const gridObjects = createGridFn(canvas);
      
      if (gridObjects && gridObjects.length > 0) {
        console.log(`Grid recovery successful with custom function: ${gridObjects.length} objects created`);
        gridLayerRef.current = gridObjects;
        return true;
      }
    }
    
    // As a last resort, use the emergency grid
    console.log("Attempting grid recovery with emergency grid");
    const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    if (emergencyGrid && emergencyGrid.length > 0) {
      console.log(`Grid recovery successful with emergency grid: ${emergencyGrid.length} objects created`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error during grid recovery:", error);
    return false;
  }
};

/**
 * Force grid creation as a last resort
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Forcing grid creation as last resort");
  
  try {
    // First clear any existing objects on the canvas to avoid duplication
    canvas.clear();
    
    // Reset the grid layer reference
    gridLayerRef.current = [];
    
    // Create a fresh emergency grid
    return createBasicEmergencyGrid(canvas, gridLayerRef);
  } catch (error) {
    console.error("Error during force grid creation:", error);
    return [];
  }
};
