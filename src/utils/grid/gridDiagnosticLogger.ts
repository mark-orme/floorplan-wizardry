
/**
 * Grid diagnostic logger
 * Utilities for logging grid state for debugging
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Log the current state of the grid
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 */
export function logGridState(
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void {
  try {
    if (!canvas) {
      console.log("Cannot log grid state: Canvas is null");
      return;
    }
    
    const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
    
    console.log("Grid state:", {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      totalObjects: canvas.getObjects().length,
      gridObjects: gridObjects.length,
      gridObjectsOnCanvas: objectsOnCanvas,
      percentOnCanvas: gridObjects.length ? Math.round((objectsOnCanvas / gridObjects.length) * 100) : 0
    });
  } catch (error) {
    console.error("Error logging grid state:", error);
  }
}

/**
 * Set up diagnostic monitoring on a canvas
 * @param {FabricCanvas} canvas - The fabric canvas instance
 */
export function setupGridDiagnosticMonitoring(canvas: FabricCanvas): void {
  try {
    // Log canvas state
    console.log("Canvas diagnostic info:", {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length,
      renderOnAddRemove: canvas.renderOnAddRemove
    });
    
    // Listen for object added/removed events
    canvas.on('object:added', () => {
      console.log("Object added to canvas, total objects:", canvas.getObjects().length);
    });
    
    canvas.on('object:removed', () => {
      console.log("Object removed from canvas, total objects:", canvas.getObjects().length);
    });
    
  } catch (error) {
    console.error("Error setting up grid diagnostic monitoring:", error);
  }
}
