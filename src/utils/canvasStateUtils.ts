
/**
 * Utilities for applying canvas state changes
 * @module canvasStateUtils
 */
import { Canvas as FabricCanvas, Polyline, Path } from "fabric";
import { isGridObject } from "./historyUtils";

/**
 * Apply a state from history to the canvas
 */
export const applyCanvasState = (
  fabricCanvas: FabricCanvas | null,
  state: any[],
  gridLayerRef: React.MutableRefObject<any[]>,
  recalculateGIA: () => void
): void => {
  console.log(`Applying state with ${state.length} objects`);
  if (!fabricCanvas) return;
  
  // Remove existing non-grid objects
  const existingObjects = fabricCanvas.getObjects().filter(obj => 
    !isGridObject(obj, gridLayerRef) && (obj.type === 'polyline' || obj.type === 'path')
  );
  
  console.log(`Removing ${existingObjects.length} existing objects`);
  existingObjects.forEach(obj => {
    try {
      fabricCanvas.remove(obj);
    } catch (err) {
      console.warn("Error removing object:", err);
    }
  });
  
  // Create and add new objects from state
  if (state.length > 0) {
    console.log(`Restoring ${state.length} objects`);
    state.forEach(objData => {
      try {
        let obj = null;
        
        if (objData.type === 'polyline') {
          obj = new Polyline(objData.points, {
            ...objData,
            selectable: false
          });
        } else if (objData.type === 'path') {
          obj = new Path(objData.path, {
            ...objData,
            selectable: false
          });
        }
        
        if (obj) {
          fabricCanvas.add(obj);
        }
      } catch (err) {
        console.error("Error adding object from history:", err);
      }
    });
  }
  
  // Ensure grid remains in background
  gridLayerRef.current.forEach(gridObj => {
    if (fabricCanvas.contains(gridObj)) {
      fabricCanvas.sendObjectToBack(gridObj);
    }
  });
  
  // Always do a full render to ensure changes are visible
  fabricCanvas.requestRenderAll();
  
  // Recalculate area after state change
  recalculateGIA();
};

