
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas } from "fabric";
import { 
  gridManager,
  resetGridProgress,
  scheduleGridProgressReset,
  acquireGridCreationLock,
  releaseGridCreationLock
} from "./gridManager";
import { renderGridComponents } from "./gridRenderer";

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
  
  // CRITICAL: Force reset any existing grid lock before trying to acquire one
  resetGridProgress();
  
  // Attempt to acquire a lock for grid creation
  if (!acquireGridCreationLock()) {
    console.log("Grid creation already in progress (locked), skipping");
    return gridLayerRef.current;
  }
  
  // Generate a unique lock ID for this creation attempt
  const lockId = gridManager.creationLock.id;
  
  // Schedule a safety timeout to reset the flag after 5 seconds
  const safetyTimeoutId = scheduleGridProgressReset(gridManager.safetyTimeout);
  
  console.log("Starting grid creation with lock ID:", lockId);
  
  try {
    // Get the current timestamp
    const now = Date.now();
    gridManager.lastCreationTime = now;
    
    // Store the dimensions for future reference
    gridManager.lastDimensions = { ...canvasDimensions };
    
    // Remove existing grid objects if any
    if (gridLayerRef.current.length > 0) {
      console.log(`Removing ${gridLayerRef.current.length} existing grid objects`);
      const existingObjects = [...gridLayerRef.current];
      existingObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          try {
            canvas.remove(obj);
          } catch (err) {
            console.warn("Error removing existing grid object:", err);
          }
        }
      });
      gridLayerRef.current = [];
    }
    
    // Apply minimum dimensions to avoid zero-size grid issues
    const canvasWidth = Math.max(canvas.width || canvasDimensions.width, 200);
    const canvasHeight = Math.max(canvas.height || canvasDimensions.height, 200);
    
    console.log(`Canvas dimensions for grid creation: ${canvasWidth}x${canvasHeight}`);
    
    // Create all grid components at once
    const result = renderGridComponents(canvas, canvasWidth, canvasHeight);
    
    if (result.gridObjects.length === 0) {
      console.warn("No grid objects were created - trying hardcoded dimensions");
      // Try with hardcoded dimensions as fallback
      const fallbackResult = renderGridComponents(canvas, 800, 600);
      if (fallbackResult.gridObjects.length > 0) {
        console.log("Fallback grid creation succeeded");
        gridLayerRef.current = fallbackResult.gridObjects;
        gridManager.exists = true;
        setDebugInfo(prev => ({...prev, gridCreated: true}));
        
        // Force a render
        canvas.requestRenderAll();
        
        // Clear the safety timeout
        clearTimeout(safetyTimeoutId);
        
        // Release the lock
        releaseGridCreationLock(lockId);
        
        return fallbackResult.gridObjects;
      }
    } else {
      // Store grid objects in the reference for later use
      gridLayerRef.current = result.gridObjects;
      
      // Set the grid exists flag
      gridManager.exists = true;
      
      // Detailed grid creation log
      console.log(`Grid created with ${result.gridObjects.length} objects (${result.smallGridLines.length} small, ${result.largeGridLines.length} large, ${result.markers.length} markers)`);
      
      // Force a complete render
      canvas.requestRenderAll();
      
      // Update debug info
      setDebugInfo(prev => ({...prev, gridCreated: true}));
      
      // Clear the safety timeout
      clearTimeout(safetyTimeoutId);
      
      // Release the lock
      releaseGridCreationLock(lockId);
      
      return result.gridObjects;
    }
    
    // If we got here, both attempts failed
    console.error("Grid creation failed - all attempts returned no objects");
    setHasError(true);
    setErrorMessage("Failed to create grid after multiple attempts");
    
    // Clear the safety timeout
    clearTimeout(safetyTimeoutId);
    
    // Release the lock
    releaseGridCreationLock(lockId);
    
    return [];
  } catch (err) {
    // Clear the safety timeout
    clearTimeout(safetyTimeoutId);
    console.error("Error creating grid:", err);
    
    // Release the lock in case of error
    releaseGridCreationLock(lockId);
    
    setHasError(true);
    setErrorMessage(`Error creating grid: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
};
