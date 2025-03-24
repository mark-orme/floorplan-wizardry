
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
  gridManager,
  resetGridProgress,
  scheduleGridProgressReset,
  acquireGridCreationLock,
  releaseGridCreationLock
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

  // Ensure valid dimensions
  if (!canvasDimensions.width || !canvasDimensions.height || 
      canvasDimensions.width <= 0 || canvasDimensions.height <= 0) {
    console.error("Invalid dimensions in createGrid:", canvasDimensions);
    return gridLayerRef.current;
  }

  // Check if grid already exists and if dimensions are close enough
  const gridExists = gridLayerRef.current.length > 0;
  
  if (gridExists && gridManager.exists) {
    const oldDims = gridManager.lastDimensions;
    const percentWidthChange = Math.abs((canvasDimensions.width - oldDims.width) / oldDims.width);
    const percentHeightChange = Math.abs((canvasDimensions.height - oldDims.height) / oldDims.height);
    
    // Only recreate if dimensions changed by more than 20%
    if (percentWidthChange < 0.2 && percentHeightChange < 0.2) {
      console.log("Grid already exists with similar dimensions, skipping creation");
      return gridLayerRef.current;
    } else {
      console.log("Dimensions changed significantly, recreating grid");
    }
  }
  
  // IMPROVED LOCK ACQUISITION - Try to acquire grid creation lock
  if (!acquireGridCreationLock()) {
    console.log("Grid creation already in progress (locked), skipping");
    return gridLayerRef.current;
  }
  
  // Generate a unique lock ID for this creation attempt
  const lockId = gridManager.creationLock.id;
  
  // Clear any existing batch timeout
  if (gridManager.batchTimeoutId) {
    clearTimeout(gridManager.batchTimeoutId);
  }
  
  // Schedule a safety timeout to reset the flag after 5 seconds
  const safetyTimeoutId = scheduleGridProgressReset(gridManager.safetyTimeout);
  
  console.log("Starting grid creation batch process - acquired lock:", lockId);
  
  // Execute immediately without batching for faster response
  try {
    // Get the current timestamp
    const now = Date.now();
    gridManager.lastCreationTime = now;
    
    // Create the grid using the batch operation
    const result = createGridBatch(
      canvas,
      gridLayerRef,
      canvasDimensions,
      setDebugInfo,
      setHasError,
      setErrorMessage,
      now,
      gridManager
    );
    
    // Clear the safety timeout since we completed successfully
    clearTimeout(safetyTimeoutId);
    
    if (result.length > 0) {
      console.log(`Grid creation complete, returning ${result.length} objects`);
      // Force a render to ensure grid is visible
      canvas.requestRenderAll();
      
      // Release the lock we acquired
      releaseGridCreationLock(lockId);
      
      return result;
    } else {
      console.error("Grid creation returned 0 objects - critical failure");
      // Reset progress flag to allow future attempts
      resetGridProgress();
      return gridLayerRef.current;
    }
  } catch (err) {
    // Clear the safety timeout
    clearTimeout(safetyTimeoutId);
    console.error("Error creating grid:", err);
    
    // Release the lock in case of error
    releaseGridCreationLock(lockId);
    
    return handleGridCreationError(
      err, 
      setHasError, 
      setErrorMessage, 
      gridManager
    );
  }
};
