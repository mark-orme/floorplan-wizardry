
/**
 * Grid diagnostic logger
 * Helps track and diagnose grid rendering issues
 * @module utils/grid/gridDiagnosticLogger
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Log grid state for debugging
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to log
 */
export const logGridState = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  if (!canvas) {
    console.error("Cannot log grid state: Canvas is null");
    return;
  }
  
  // Count grid objects on canvas
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  
  console.debug("Grid State:", {
    canvasDimensions: `${canvas.width}x${canvas.height}`,
    gridObjectsTotal: gridObjects.length,
    gridObjectsOnCanvas: gridObjectsOnCanvas.length,
    missingGridObjects: gridObjects.length - gridObjectsOnCanvas.length
  });
};

/**
 * Set up diagnostic monitoring on canvas
 * @param {FabricCanvas} canvas - Canvas to monitor
 */
export const setupGridDiagnosticMonitoring = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Log when objects are added/removed
  canvas.on('object:added', () => {
    console.debug("Canvas: Object added", {
      objectCount: canvas.getObjects().length
    });
  });
  
  canvas.on('object:removed', () => {
    console.debug("Canvas: Object removed", {
      objectCount: canvas.getObjects().length
    });
  });
  
  console.debug("Grid diagnostic monitoring set up");
};

/**
 * Grid diagnostic stats
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to analyze
 * @returns {Object} Grid stats
 */
export const gridDebugStats = (canvas: FabricCanvas, gridObjects: FabricObject[]): any => {
  if (!canvas) return { error: "Canvas is null" };
  
  const stats = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    totalGridObjects: gridObjects.length,
    gridObjectsOnCanvas: gridObjects.filter(obj => canvas.contains(obj)).length,
    canvasObjectCount: canvas.getObjects().length
  };
  
  return stats;
};

/**
 * Diagnose grid creation failure
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {Error} error - Error that occurred
 * @returns {Object} Diagnostic information
 */
export const diagnoseGridFailure = (canvas: FabricCanvas, error: Error): any => {
  const diagnosis = {
    error: error.message,
    stack: error.stack,
    canvasState: canvas ? {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length
    } : "Canvas is null"
  };
  
  return diagnosis;
};
