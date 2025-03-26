/**
 * Utilities for Fabric.js canvas management
 * @module fabricCanvas
 */
import { Canvas, Object as FabricObject } from "fabric";
import { CanvasDimensions } from "@/types/drawingTypes";

// Use a module-level object to track state instead of loose variables
const canvasState = {
  prevDimensions: { width: 0, height: 0 },
  dimensionUpdateCount: 0,
  initialSetupComplete: false
};

/**
 * Safely sets canvas dimensions and refreshes the canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {CanvasDimensions} dimensions - Object containing width and height to set
 */
export const setCanvasDimensions = (
  canvas: Canvas, 
  dimensions: CanvasDimensions
): void => {
  if (!canvas) {
    console.error("Cannot set dimensions: canvas is null");
    return;
  }
  
  try {
    const { width, height } = dimensions;
    
    // More aggressive tolerance - skip update for small changes
    if (Math.abs(width - canvasState.prevDimensions.width) < 20 && 
        Math.abs(height - canvasState.prevDimensions.height) < 20) {
      return;
    }
    
    // Store new dimensions
    canvasState.prevDimensions = { width, height };
    
    // Increment update count
    canvasState.dimensionUpdateCount++;
    
    // Only log first dimension update and every 20th after that to reduce console spam
    if (!canvasState.initialSetupComplete || canvasState.dimensionUpdateCount % 20 === 0) {
      console.log(`Setting canvas dimensions to ${width}x${height}`);
      canvasState.initialSetupComplete = true;
    }
    
    // Use higher dimensions values
    const finalWidth = Math.max(width, 1200);
    const finalHeight = Math.max(height, 950);
    
    canvas.setDimensions({ width: finalWidth, height: finalHeight });
    
    // Force render
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Failed to set canvas dimensions:", error);
  }
};

/**
 * Properly dispose the canvas instance to prevent memory leaks
 * @param {Canvas|null} canvas - The Fabric canvas instance to dispose
 */
export const disposeCanvas = (canvas: Canvas | null): void => {
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
    try {
      // Safely check if the canvas element can be retrieved
      // The error is happening here when trying to access el on undefined
      if (canvas && typeof canvas.getElement === 'function') {
        try {
          const canvasElement = canvas.getElement();
          // Add null check before accessing properties
          if (canvasElement && canvasElement.parentNode) {
            try {
              // Remove the canvas from DOM to prevent duplicate canvas initialization
              canvasElement.parentNode.removeChild(canvasElement);
            } catch (err) {
              console.warn("Failed to remove canvas from DOM:", err);
            }
          }
        } catch (err) {
          // Handle the case where getElement() itself might fail
          console.warn("Failed to get canvas element during disposal:", err);
        }
      } else {
        console.warn("Cannot get canvas element: getElement method not available");
      }
    } catch (err) {
      console.warn("Error during canvas DOM cleanup:", err);
    }
    
    console.log("Canvas disposed successfully");
  } catch (error) {
    console.error("Error disposing canvas:", error);
  }
};

/**
 * Clear objects from canvas while preserving grid
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to preserve
 */
export const clearCanvasObjects = (canvas: Canvas, gridObjects: FabricObject[]): void => {
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
