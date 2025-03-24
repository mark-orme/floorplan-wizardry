
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

  // Ensure valid dimensions
  if (!canvasDimensions.width || !canvasDimensions.height || 
      canvasDimensions.width <= 0 || canvasDimensions.height <= 0) {
    console.error("Invalid dimensions in createGrid:", canvasDimensions);
    return gridLayerRef.current;
  }

  // Force grid creation regardless of existing state - previous code might be skipping grid creation
  console.log("Proceeding with grid creation regardless of existing state");
  
  // Prevent multiple concurrent grid creations
  if (gridManager.inProgress) {
    console.log("Grid creation already in progress, skipping");
    return gridLayerRef.current;
  }
  
  // Clear any existing batch timeout
  if (gridManager.batchTimeoutId) {
    clearTimeout(gridManager.batchTimeoutId);
  }
  
  gridManager.inProgress = true;
  console.log("Starting grid creation batch process");
  
  // Execute immediately without batching for faster response
  try {
    // Get the current timestamp
    const now = Date.now();
    
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
    
    console.log(`Grid creation complete, returning ${result.length} objects`);
    return result;
  } catch (err) {
    console.error("Error creating grid:", err);
    return handleGridCreationError(
      err, 
      setHasError, 
      setErrorMessage, 
      gridManager
    );
  }
};
