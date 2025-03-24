
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas } from "fabric";
import { 
  shouldThrottleGridCreation, 
  hasDimensionsChangedSignificantly, 
  createGridBatch, 
  handleGridCreationError,
  gridManager
} from "./gridOperations";

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
  console.log("createGrid called with dimensions:", canvasDimensions);
  
  // Basic validation
  if (!canvas) {
    console.error("Canvas is null in createGrid");
    return [];
  }
  
  if (!gridLayerRef) {
    console.error("gridLayerRef is null in createGrid");
    return [];
  }

  // If grid already exists, don't create a new one
  if (gridManager.exists && gridLayerRef.current.length > 0) {
    // Check if grid objects are still on the canvas
    const gridOnCanvas = gridLayerRef.current.some(obj => canvas.contains(obj));
    
    if (gridOnCanvas) {
      console.log("Grid already exists and is on canvas, skipping creation");
      return gridLayerRef.current;
    } else {
      console.log("Grid exists in reference but not on canvas, will recreate");
    }
  }
  
  // Prevent multiple concurrent grid creations
  if (gridManager.inProgress) {
    console.log("Grid creation already in progress, skipping");
    return gridLayerRef.current;
  }
  
  // If grid already exists, don't recreate unless dimensions change significantly
  if (gridManager.initialized && gridLayerRef.current.length > 0) {
    if (!hasDimensionsChangedSignificantly(gridManager.lastDimensions, canvasDimensions)) {
      console.log("Canvas dimensions haven't changed significantly, using existing grid");
      return gridLayerRef.current;
    } else {
      console.log("Canvas dimensions changed significantly, recreating grid");
    }
  }
  
  // Enforce throttling limits
  const now = Date.now();
  if (shouldThrottleGridCreation(now)) {
    console.log("Grid creation throttled, skipping");
    return gridLayerRef.current;
  }
  
  // Batch concurrent requests in a single operation
  if (gridManager.batchTimeoutId) {
    clearTimeout(gridManager.batchTimeoutId);
  }
  
  gridManager.inProgress = true;
  console.log("Starting grid creation batch process");
  
  // Use a timeout to batch rapid calls - reduced from 100ms to 50ms for faster response
  gridManager.batchTimeoutId = window.setTimeout(() => {
    try {
      // Create the grid using the extracted batch operation
      return createGridBatch(
        canvas,
        gridLayerRef,
        canvasDimensions,
        setDebugInfo,
        setHasError,
        setErrorMessage,
        now,
        gridManager
      );
    } catch (err) {
      console.error("Error creating grid:", err);
      return handleGridCreationError(
        err, 
        setHasError, 
        setErrorMessage, 
        gridManager
      );
    }
  }, 50);
  
  return gridLayerRef.current;
};
