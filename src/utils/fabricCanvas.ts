
/**
 * Utilities for Fabric.js canvas management
 * @module fabricCanvas
 */
import { Canvas } from "fabric";

// Keep track of previous dimensions to avoid unnecessary updates
let prevDimensions = { width: 0, height: 0 };
// Track dimension update count to reduce logging
let dimensionUpdateCount = 0;

/**
 * Safely sets canvas dimensions and refreshes the canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {{ width: number, height: number }} dimensions - Object containing width and height to set
 */
export const setCanvasDimensions = (
  canvas: Canvas, 
  dimensions: { width: number, height: number }
) => {
  if (!canvas) {
    console.error("Cannot set dimensions: canvas is null");
    return;
  }
  
  try {
    const { width, height } = dimensions;
    
    // Skip update if dimensions are the same or within 10px tolerance
    if (Math.abs(width - prevDimensions.width) < 10 && 
        Math.abs(height - prevDimensions.height) < 10) {
      return;
    }
    
    // Store new dimensions
    prevDimensions = { width, height };
    
    // Increment update count
    dimensionUpdateCount++;
    
    // Only log every 3rd dimension update to reduce console spam
    if (dimensionUpdateCount % 3 === 0) {
      console.log(`Setting canvas dimensions to ${width}x${height}`);
    }
    
    canvas.setDimensions({ width, height });
    
    // Only render if dimensions have changed significantly
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Failed to set canvas dimensions:", error);
  }
};

/**
 * Properly dispose the canvas instance to prevent memory leaks
 * @param {Canvas|null} canvas - The Fabric canvas instance to dispose
 */
export const disposeCanvas = (canvas: Canvas | null) => {
  if (!canvas) {
    console.log("No canvas to dispose");
    return;
  }
  
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
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {any[]} gridObjects - Grid objects to preserve
 */
export const clearCanvasObjects = (canvas: Canvas, gridObjects: any[]) => {
  if (!canvas) {
    console.error("Cannot clear canvas: canvas is null");
    return;
  }
  
  try {
    console.log(`Clearing canvas objects while preserving ${gridObjects.length} grid objects`);
    
    // Get all objects that are not grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridObjects.includes(obj)
    );
    
    console.log(`Found ${objectsToRemove.length} objects to remove`);
    
    // Remove them
    objectsToRemove.forEach(obj => {
      canvas.remove(obj);
    });
    
    canvas.renderAll();
  } catch (error) {
    console.error("Error clearing canvas objects:", error);
  }
};
