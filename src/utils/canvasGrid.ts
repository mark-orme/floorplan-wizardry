
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas } from "fabric";
import { shouldThrottleCreation } from "./gridManager";
import { validateCanvasForGrid } from "./grid/gridValidation";
import { createGridLayer, createFallbackGrid } from "./grid/gridCreator";
import { handleGridCreationError } from "./grid/gridErrorHandling";
import { acquireGridLockWithSafety, cleanupGridResources } from "./grid/gridSafety";

/**
 * Create grid lines for the canvas
 * Creates both small (0.1m) and large (1m) grid lines with consistent performance
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to store grid objects
 * @param {{ width: number, height: number }} canvasDimensions - Current canvas dimensions
 * @param {Function} setDebugInfo - Function to update debug info state
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 * @returns {any[]} Array of created grid objects
 */
export const createGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<any[]>,
  canvasDimensions: { width: number, height: number },
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("createGrid called with dimensions:", canvasDimensions);
  }
  
  // Validate inputs first
  if (!validateCanvasForGrid(canvas, gridLayerRef, canvasDimensions)) {
    return gridLayerRef.current;
  }
  
  // Check if we should throttle
  if (shouldThrottleCreation()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Throttling grid creation due to too many recent attempts");
    }
    
    // Return current grid without creating a new one
    return gridLayerRef.current;
  }
  
  // Add a small delay before attempting to acquire a lock to prevent race conditions
  setTimeout(() => {
    // Acquire lock with safety timeout
    const lockInfo = acquireGridLockWithSafety();
    if (!lockInfo) {
      return gridLayerRef.current;
    }
    
    const { lockId, safetyTimeoutId } = lockInfo;
    
    try {
      // Get the current timestamp
      const currentTime = Date.now();
      
      // Create the grid layer
      createGridLayer(canvas, gridLayerRef, canvasDimensions, setDebugInfo);
      
      // Force a render
      canvas.requestRenderAll();
      
      // Clean up resources
      cleanupGridResources(lockId, safetyTimeoutId);
      
      return gridLayerRef.current;
    } catch (error) {
      // Handle errors
      handleGridCreationError(error, setHasError, setErrorMessage);
      
      // Clean up resources
      cleanupGridResources(lockId, safetyTimeoutId);
      
      return [];
    }
  }, 100); // Increased delay from 50ms to 100ms to reduce rapid creation attempts
  
  // Return current grid until the async creation completes
  return gridLayerRef.current;
};

// Re-export all grid utility functions for easier imports
export * from "./grid/gridCreator";
export * from "./grid/gridValidation";
export * from "./grid/gridErrorHandling";
export * from "./grid/gridSafety";
