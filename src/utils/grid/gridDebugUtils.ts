
/**
 * Grid debugging utilities
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "../gridCreationUtils";

/**
 * Dump grid state to console
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to dump
 */
export const dumpGridState = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  if (!canvas) {
    console.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  const canvasObjects = canvas.getObjects();
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  
  console.log("Grid State:", {
    canvasDimensions: `${canvas.width}x${canvas.height}`,
    totalCanvasObjects: canvasObjects.length,
    gridObjectsCount: gridObjects.length,
    gridObjectsOnCanvas: gridObjectsOnCanvas.length,
    missingGridObjects: gridObjects.length - gridObjectsOnCanvas.length
  });
};

/**
 * Force create grid on canvas
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot force create grid: Canvas is null");
    return [];
  }
  
  // Remove existing grid objects
  if (gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
  }
  
  // Create new grid
  const gridObjects = createBasicEmergencyGrid(canvas);
  gridLayerRef.current = gridObjects;
  
  // Force render
  canvas.requestRenderAll();
  
  console.log(`Force created grid with ${gridObjects.length} objects`);
  return gridObjects;
};
