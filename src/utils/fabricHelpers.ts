
import { Canvas, PencilBrush } from "fabric";

/**
 * Initialize a drawing brush for a Fabric canvas
 * @param canvas The Fabric canvas instance
 * @returns The initialized brush
 */
export const initializeDrawingBrush = (canvas: Canvas) => {
  if (!canvas) return null;
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    return brush;
  } catch (error) {
    console.error("Failed to initialize drawing brush:", error);
    return null;
  }
};

/**
 * Safely sets canvas dimensions and refreshes the canvas
 * @param canvas The Fabric canvas instance
 * @param width Width to set
 * @param height Height to set
 */
export const setCanvasDimensions = (canvas: Canvas, width: number, height: number) => {
  if (!canvas) return;
  
  try {
    canvas.setDimensions({ width, height });
    canvas.renderAll();
  } catch (error) {
    console.error("Failed to set canvas dimensions:", error);
  }
};

/**
 * Properly dispose the canvas instance to prevent memory leaks
 * @param canvas The Fabric canvas instance to dispose
 */
export const disposeCanvas = (canvas: Canvas | null) => {
  if (!canvas) return;
  
  try {
    // Remove all event listeners
    canvas.off();
    
    // Clear all objects
    canvas.clear();
    
    // Dispose the canvas
    canvas.dispose();
    
    console.log("Canvas disposed successfully");
  } catch (error) {
    console.error("Error disposing canvas:", error);
  }
};

/**
 * Clear objects from canvas while preserving grid
 * @param canvas The Fabric canvas instance
 * @param gridObjects Grid objects to preserve
 */
export const clearCanvasObjects = (canvas: Canvas, gridObjects: any[]) => {
  if (!canvas) return;
  
  try {
    // Get all objects that are not grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridObjects.includes(obj)
    );
    
    // Remove them
    objectsToRemove.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.renderAll();
  } catch (error) {
    console.error("Error clearing canvas objects:", error);
  }
};

