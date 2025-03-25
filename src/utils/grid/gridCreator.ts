
/**
 * Grid creator module
 * Core functionality for creating grid on canvas
 * @module gridCreator
 */
import { Canvas } from "fabric";
import { gridManager, resetGridProgress, acquireGridCreationLock, releaseGridCreationLock } from "../gridManager";
import { validateCanvasForGrid } from "./gridValidation";
import { renderGridComponents } from "../gridRenderer";
import { arrangeGridObjects } from "../gridRenderer";
import { handleGridCreationError, scheduleGridRetry } from "./gridErrorHandling";

/**
 * Create grid layer on the canvas with safety mechanisms
 * Creates the actual grid after validation passes
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to store grid objects
 * @param {Object} canvasDimensions - Current canvas dimensions
 * @param {Function} setDebugInfo - Function to update debug info state
 * @returns {any[]} Created grid objects
 */
export const createGridLayer = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<any[]>,
  canvasDimensions: { width: number, height: number },
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>
): any[] => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Creating grid layer with dimensions:", canvasDimensions);
  }
  
  // Store the dimensions for future reference
  gridManager.lastDimensions = { ...canvasDimensions };
  
  // Remove existing grid objects if any
  if (gridLayerRef.current.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Removing ${gridLayerRef.current.length} existing grid objects`);
    }
    
    const existingObjects = [...gridLayerRef.current];
    existingObjects.forEach(object => {
      if (canvas.contains(object)) {
        try {
          canvas.remove(object);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn("Error removing existing grid object:", error);
          }
        }
      }
    });
    gridLayerRef.current = [];
  }
  
  // Apply minimum dimensions to avoid zero-size grid issues
  const canvasWidth = Math.max(canvas.width || canvasDimensions.width, 200);
  const canvasHeight = Math.max(canvas.height || canvasDimensions.height, 200);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Canvas dimensions for grid creation: ${canvasWidth}x${canvasHeight}`);
  }
  
  // Create all grid components at once
  const result = renderGridComponents(canvas, canvasWidth, canvasHeight);
  
  // Proper error handling and fallback logic
  if (!result.gridObjects.length) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("No grid objects were created - trying hardcoded dimensions");
    }
    
    // Try with hardcoded dimensions as fallback
    return createFallbackGrid(canvas, gridLayerRef, setDebugInfo);
  } 
  
  // Arrange grid objects in correct z-order
  arrangeGridObjects(
    canvas,
    result.smallGridLines,
    result.largeGridLines,
    result.markers
  );
  
  // Store grid objects in the reference for later use
  gridLayerRef.current = result.gridObjects;
  
  // Set the grid exists flag
  gridManager.exists = true;
  
  // Reset consecutive resets counter on success
  gridManager.consecutiveResets = 0;
  
  if (process.env.NODE_ENV === 'development') {
    // Detailed grid creation log
    console.log(`Grid created with ${result.gridObjects.length} objects (${result.smallGridLines.length} small, ${result.largeGridLines.length} large, ${result.markers.length} markers)`);
  }
  
  // Force a complete render
  canvas.requestRenderAll();
  
  // Update debug info
  setDebugInfo(prev => ({...prev, gridCreated: true}));
  
  return result.gridObjects;
};

/**
 * Create a fallback grid when normal grid creation fails
 * Uses hardcoded dimensions as a last resort
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to store grid objects
 * @param {Function} setDebugInfo - Function to update debug info state
 * @returns {any[]} Created fallback grid objects
 */
export const createFallbackGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<any[]>,
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>
): any[] => {
  const fallbackResult = renderGridComponents(canvas, 800, 600);
  
  if (fallbackResult.gridObjects.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Fallback grid creation succeeded");
    }
    
    // Arrange grid objects properly
    arrangeGridObjects(
      canvas,
      fallbackResult.smallGridLines,
      fallbackResult.largeGridLines,
      fallbackResult.markers
    );
    
    gridLayerRef.current = fallbackResult.gridObjects;
    gridManager.exists = true;
    setDebugInfo(prev => ({...prev, gridCreated: true}));
    
    // Force a render
    canvas.requestRenderAll();
    
    // Reset consecutive resets counter on success
    gridManager.consecutiveResets = 0;
    
    return fallbackResult.gridObjects;
  }
  
  return [];
}
