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
  initialSetupComplete: false,
  disposalInProgress: false,
  // Keep track of disposed canvases to prevent re-disposing
  disposedCanvases: new WeakSet<Canvas>()
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
 * Safely check if a canvas is valid and not already disposed
 * @param {Canvas|null} canvas - The Fabric canvas instance to check
 * @returns {boolean} Whether the canvas is valid
 */
export const isCanvasValid = (canvas: Canvas | null): boolean => {
  if (!canvas) return false;
  
  // If we know this canvas has been disposed, return false immediately
  if (canvasState.disposedCanvases.has(canvas)) {
    return false;
  }
  
  try {
    // Check if the canvas has been explicitly marked as disposed
    if ((canvas as any).disposed === true) {
      return false;
    }
    
    // Try to access some methods that should exist on valid canvas instances
    return (
      typeof canvas.getObjects === 'function' &&
      typeof canvas.renderAll === 'function'
    );
  } catch (error) {
    console.warn("Error checking canvas validity:", error);
    return false;
  }
};

/**
 * Safely get canvas element if available
 * @param {Canvas} canvas - The Fabric canvas instance
 * @returns {HTMLCanvasElement|null} The canvas element or null
 */
export const safelyGetCanvasElement = (canvas: Canvas): HTMLCanvasElement | null => {
  if (!canvas) return null;
  
  try {
    // First check if we can directly access the element via lowerCanvasEl (fabric implementation detail)
    const directElement = (canvas as any).lowerCanvasEl;
    if (directElement instanceof HTMLCanvasElement) {
      return directElement;
    }
    
    // If not, try the getElement method if available
    if (typeof canvas.getElement === 'function') {
      try {
        const element = canvas.getElement();
        return element instanceof HTMLCanvasElement ? element : null;
      } catch (error) {
        console.warn("Error accessing canvas element:", error);
        return null;
      }
    }
  } catch (error) {
    console.warn("Error getting canvas element:", error);
  }
  
  return null;
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
  
  // Check if this canvas is already being disposed or has been disposed
  if (canvasState.disposalInProgress || canvasState.disposedCanvases.has(canvas)) {
    console.log("Canvas disposal already in progress or already disposed, skipping");
    return;
  }
  
  canvasState.disposalInProgress = true;
  
  // Mark this canvas as disposed to prevent future disposal attempts
  canvasState.disposedCanvases.add(canvas);
  
  // Set a flag to track if we've successfully disposed
  let disposedSuccessfully = false;
  
  try {
    // First check if canvas is valid
    if (!isCanvasValid(canvas)) {
      console.log("Canvas appears to be invalid or already disposed");
      canvasState.disposalInProgress = false;
      return;
    }
    
    // Safe approach to disposal - prevent issues with Fabric.js internals
    try {
      // First, remove all event listeners
      canvas.off();
      
      // Mark the canvas as disposed first, before removing objects
      // This helps prevent callbacks that might try to use the canvas during disposal
      (canvas as any).disposed = true;
      
      // Remove all objects one by one to avoid batch operations
      const objects = [...canvas.getObjects()];
      objects.forEach(obj => {
        try {
          canvas.remove(obj);
        } catch (err) {
          // Silently fail for individual object removals
        }
      });
      
      // Get the canvas element before disposal (might be needed for DOM cleanup)
      const canvasElement = safelyGetCanvasElement(canvas);
      
      // Finally dispose the canvas
      canvas.dispose();
      
      // Mark flag since we successfully disposed the canvas
      disposedSuccessfully = true;
      
      // If we got the element earlier, try to remove it from DOM as well
      if (canvasElement && canvasElement.parentNode) {
        try {
          canvasElement.parentNode.removeChild(canvasElement);
        } catch (err) {
          console.warn("Failed to remove canvas from DOM:", err);
        }
      }
    } catch (err) {
      console.warn("Standard canvas disposal failed:", err);
      
      // Even if there's an error, we want to try alternate approaches
      try {
        // Add a flag to canvas to mark it as disposed
        (canvas as any).disposed = true;
        
        // Try to access and remove the canvas element directly
        const canvasElement = safelyGetCanvasElement(canvas);
        if (canvasElement && canvasElement.parentNode) {
          canvasElement.parentNode.removeChild(canvasElement);
          disposedSuccessfully = true;
        }
      } catch (domErr) {
        console.warn("DOM cleanup also failed:", domErr);
      }
    }
    
    if (disposedSuccessfully) {
      console.log("Canvas disposed successfully");
    } else {
      console.warn("Canvas may not have been fully disposed");
    }
  } catch (error) {
    console.error("Error disposing canvas:", error);
  } finally {
    canvasState.disposalInProgress = false;
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

/**
 * Check if a canvas is already disposed
 * @param {Canvas|null} canvas - The Fabric canvas instance to check
 * @returns {boolean} Whether the canvas is disposed
 */
export const isCanvasDisposed = (canvas: Canvas | null): boolean => {
  if (!canvas) return true;
  
  return canvasState.disposedCanvases.has(canvas) || 
         (canvas as any).disposed === true;
};

/**
 * Reset the canvas state tracker
 * This is useful if the app gets into a bad state
 */
export const resetCanvasStateTracker = (): void => {
  canvasState.disposalInProgress = false;
  console.log("Canvas state tracker has been reset");
};
