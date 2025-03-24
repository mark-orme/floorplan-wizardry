
/**
 * Utilities for Fabric.js canvas management
 * @module fabricCanvas
 */
import { Canvas } from "fabric";

// Keep track of previous dimensions to avoid unnecessary updates
let prevDimensions = { width: 0, height: 0 };
// Track dimension update count to reduce logging
let dimensionUpdateCount = 0;
// Track if initial canvas setup is complete
let initialSetupComplete = false;

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
    
    // More aggressive tolerance - skip update for small changes
    // Increased from 10px to 30px to further reduce updates
    if (Math.abs(width - prevDimensions.width) < 30 && 
        Math.abs(height - prevDimensions.height) < 30) {
      return;
    }
    
    // Store new dimensions
    prevDimensions = { width, height };
    
    // Increment update count
    dimensionUpdateCount++;
    
    // Only log first dimension update and every 10th after that
    if (!initialSetupComplete || dimensionUpdateCount % 10 === 0) {
      console.log(`Setting canvas dimensions to ${width}x${height}`);
      initialSetupComplete = true;
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
    // Safe approach to disposal - prevent issues with Fabric.js internals
    try {
      // First, remove all event listeners
      canvas.off();
      
      // Remove all objects one by one to avoid batch operations
      const objects = [...canvas.getObjects()];
      objects.forEach(obj => {
        try {
          canvas.remove(obj);
        } catch (err) {
          // Silently fail for individual object removals
        }
      });
      
      // Finally dispose the canvas
      canvas.dispose();
    } catch (err) {
      // Even if there's an error in the typical disposal flow, 
      // we still want to try the direct DOM removal as fallback
      console.warn("Standard canvas disposal failed, trying alternate approach:", err);
    }
    
    // As a fallback, also try to clear the DOM 
    const canvasElement = canvas.getElement();
    if (canvasElement && canvasElement.parentNode) {
      try {
        // Remove the canvas from DOM to prevent duplicate canvas initialization
        canvasElement.parentNode.removeChild(canvasElement);
      } catch (err) {
        console.warn("Failed to remove canvas from DOM:", err);
      }
    }
    
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
    // Reduce log frequency
    if (gridObjects.length > 0) {
      console.log(`Clearing canvas objects while preserving ${gridObjects.length} grid objects`);
    }
    
    // Get all objects that are not grid
    const objectsToRemove = canvas.getObjects().filter(obj => 
      !gridObjects.includes(obj)
    );
    
    // Only log if there's something to remove
    if (objectsToRemove.length > 0) {
      console.log(`Found ${objectsToRemove.length} objects to remove`);
    }
    
    // Remove them one by one to avoid potential issues with batch operations
    objectsToRemove.forEach(obj => {
      try {
        canvas.remove(obj);
      } catch (err) {
        console.warn("Error removing object:", err);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error clearing canvas objects:", error);
  }
};
