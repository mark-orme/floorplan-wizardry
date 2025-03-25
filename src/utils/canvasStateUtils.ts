
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
 * @param {any[]} state - Array of serialized objects representing the state to apply
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {() => void} recalculateGIA - Function to recalculate Gross Internal Area after state change
 * @returns {void}
 */
export const applyCanvasState = (
  fabricCanvas: FabricCanvas | null,
  state: any[],
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
  if (state && state.length > 0) {
    logger.info(`Restoring ${state.length} objects`);
    state.forEach(objData => {
      try {
        if (!objData || !objData.type) {
          logger.warn("Invalid object data:", objData);
          return;
        }
        
        let obj: FabricObject | null = null;
        
        if (objData.type === 'polyline') {
          obj = new Polyline(objData.points || [], {
            ...objData,
            selectable: false
          });
        } else if (objData.type === 'path') {
          obj = new Path(objData.path || '', {
            ...objData,
            selectable: false
          });
        }
        
        if (obj) {
          fabricCanvas.add(obj);
          logger.info(`Added object of type ${objData.type} to canvas`);
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

/**
 * Remove the last drawn object from the canvas
 * 
 * @param {FabricCanvas | null} fabricCanvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject | null} The removed object or null
 */
export const removeLastDrawnObject = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject | null => {
  if (!fabricCanvas) return null;
  
  // Get all non-grid objects from the canvas
  const drawingObjects = fabricCanvas.getObjects().filter(obj => 
    !isGridObject(obj, gridLayerRef) && (obj.type === 'polyline' || obj.type === 'path')
  );
  
  // If there are no drawing objects, return null
  if (drawingObjects.length === 0) {
    logger.info("No objects to remove");
    return null;
  }
  
  // Get the last drawn object
  const lastObject = drawingObjects[drawingObjects.length - 1];
  logger.info(`Removing last object of type: ${lastObject.type}`);
  
  try {
    // Remove the object from the canvas
    fabricCanvas.remove(lastObject);
    fabricCanvas.requestRenderAll();
    return lastObject;
  } catch (err) {
    logger.error("Error removing last object:", err);
    return null;
  }
};

/**
 * Add an object to the canvas
 * 
 * @param {FabricCanvas | null} fabricCanvas - The Fabric.js canvas instance
 * @param {any} objectData - Serialized object data
 * @returns {FabricObject | null} The added object or null
 */
export const addObjectToCanvas = (
  fabricCanvas: FabricCanvas | null,
  objectData: any
): FabricObject | null => {
  if (!fabricCanvas || !objectData || !objectData.type) {
    return null;
  }
  
  try {
    let obj: FabricObject | null = null;
    
    if (objectData.type === 'polyline') {
      obj = new Polyline(objectData.points || [], {
        ...objectData,
        selectable: false
      });
    } else if (objectData.type === 'path') {
      obj = new Path(objectData.path || '', {
        ...objectData,
        selectable: false
      });
    }
    
    if (obj) {
      fabricCanvas.add(obj);
      fabricCanvas.requestRenderAll();
      logger.info(`Added object of type ${objectData.type} to canvas`);
      return obj;
    }
  } catch (err) {
    logger.error("Error adding object to canvas:", err);
  }
  
  return null;
};
