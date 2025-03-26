
/**
 * Utilities for canvas cleanup and disposal
 * @module fabric/canvasCleanup
 */
import { Canvas, Object as FabricObject } from "fabric";
import { safelyGetCanvasElement, markCanvasAsDisposed, isCanvasValid } from "./canvasValidation";

// State tracking for cleanup operations
const cleanupState = {
  disposalInProgress: false
};

/**
 * Forcibly clean a canvas element to allow reinitialization
 * @param {HTMLCanvasElement|null} element - The canvas element to clean
 * @returns {boolean} Whether cleaning was successful
 */
export const forceCleanCanvasElement = (element: HTMLCanvasElement | null): boolean => {
  if (!element) return false;
  
  try {
    // Remove Fabric's data attributes
    element.removeAttribute('data-fabric');
    element.removeAttribute('data-fabric-initialized');
    
    // Remove all data attributes just to be safe
    Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('data-'))
      .forEach(attr => {
        try {
          element.removeAttribute(attr.name);
        } catch (err) {
          // Ignore errors removing attributes
        }
      });
    
    // Reset the width/height style attributes
    element.style.width = '';
    element.style.height = '';
    
    return true;
  } catch (error) {
    console.error("Error cleaning canvas element:", error);
    return false;
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
  
  // Check if disposal is already in progress
  if (cleanupState.disposalInProgress) {
    console.log("Canvas disposal already in progress, skipping");
    return;
  }
  
  cleanupState.disposalInProgress = true;
  
  // Set a flag to track if we've successfully disposed
  let disposedSuccessfully = false;
  
  try {
    // First check if canvas is valid
    if (!isCanvasValid(canvas)) {
      console.log("Canvas appears to be invalid or already disposed");
      cleanupState.disposalInProgress = false;
      return;
    }
    
    // Get the canvas element before disposal (needed for DOM cleanup)
    const canvasElement = safelyGetCanvasElement(canvas);
    
    // Safely remove all objects first
    try {
      const objects = [...canvas.getObjects()];
      objects.forEach(obj => {
        try {
          canvas.remove(obj);
        } catch (err) {
          // Silently fail for individual object removals
        }
      });
    } catch (err) {
      console.warn("Error removing canvas objects:", err);
    }
    
    // Safe approach to disposal - prevent issues with Fabric.js internals
    try {
      // First, remove all event listeners
      canvas.off();
      
      // Mark the canvas as disposed
      markCanvasAsDisposed(canvas);
      
      // Finally dispose the canvas
      canvas.dispose();
      
      // Mark flag since we successfully disposed the canvas
      disposedSuccessfully = true;
      
      // If we got the element earlier, force clean it
      if (canvasElement) {
        forceCleanCanvasElement(canvasElement);
      }
    } catch (err) {
      console.warn("Standard canvas disposal failed:", err);
      
      // Even if there's an error, we want to try alternate approaches
      try {
        // Try to access and force clean the canvas element
        if (canvasElement) {
          forceCleanCanvasElement(canvasElement);
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
    cleanupState.disposalInProgress = false;
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
 * Reset the canvas state tracker
 * This is useful if the app gets into a bad state
 */
export const resetCanvasStateTracker = (): void => {
  cleanupState.disposalInProgress = false;
  console.log("Canvas state tracker has been reset");
};
