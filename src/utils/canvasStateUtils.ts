
/**
 * Utilities for applying canvas state changes
 * @module canvasStateUtils
 */
import { Canvas as FabricCanvas, Polyline, Path, Object as FabricObject } from "fabric";
import { isGridObject } from "./historyUtils";
import logger from "./logger";

/**
 * Apply a state from history to the canvas
 * Replaces current drawing objects with the ones stored in the given state
 * 
 * @param {FabricCanvas | null} fabricCanvas - The Fabric.js canvas instance
 * @param {FabricObject[]} state - Array of fabric objects representing the state to apply
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {() => void} recalculateGIA - Function to recalculate Gross Internal Area after state change
 * @returns {void}
 */
export const applyCanvasState = (
  fabricCanvas: FabricCanvas | null,
  state: FabricObject[],
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  recalculateGIA: () => void
): void => {
  logger.info(`Applying state with ${state.length} objects`);
  if (!fabricCanvas) return;
  
  // STEP 1: First remove all existing non-grid objects (complete clearing)
  const existingObjects = fabricCanvas.getObjects().filter(obj => 
    !isGridObject(obj, gridLayerRef) && (obj.type === 'polyline' || obj.type === 'path')
  );
  
  logger.info(`Removing ${existingObjects.length} existing objects`);
  existingObjects.forEach(obj => {
    try {
      fabricCanvas.remove(obj);
    } catch (err) {
      logger.warn("Error removing object:", err);
    }
  });
  
  // STEP 2: Create and add new objects from state (restoration)
  if (state.length > 0) {
    logger.info(`Restoring ${state.length} objects`);
    state.forEach(objData => {
      try {
        let obj: FabricObject | null = null;
        
        if (objData.type === 'polyline') {
          obj = new Polyline((objData as Polyline).points, {
            ...(objData as Polyline),
            selectable: false
          });
        } else if (objData.type === 'path') {
          obj = new Path((objData as Path).path, {
            ...(objData as Path),
            selectable: false
          });
        }
        
        if (obj) {
          fabricCanvas.add(obj);
        }
      } catch (err) {
        logger.error("Error adding object from history:", err);
      }
    });
  }
  
  // STEP 3: Ensure grid remains in background
  gridLayerRef.current.forEach(gridObj => {
    if (fabricCanvas.contains(gridObj)) {
      fabricCanvas.sendObjectToBack(gridObj);
    }
  });
  
  // STEP 4: Always do a full render to ensure changes are visible
  fabricCanvas.requestRenderAll();
  
  // STEP 5: Recalculate area after state change
  recalculateGIA();
};
