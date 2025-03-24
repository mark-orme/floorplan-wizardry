
/**
 * Grid operations module
 * Handles grid creation batch operations and error handling
 * @module gridOperations
 */
import { Canvas } from "fabric";
import { gridManager } from "./gridManager";
import { renderGridComponents, arrangeGridObjects } from "./gridRenderer";

// Re-export gridManager for use in other modules
export { gridManager };

/**
 * Check if grid creation should be throttled based on creation limits
 * @param now - Current timestamp
 * @returns Whether creation should be throttled
 */
export const shouldThrottleGridCreation = (now: number): boolean => {
  // If within throttle interval and grid exists, throttle creation
  if (now - gridManager.lastCreationTime < gridManager.throttleInterval && gridManager.exists) {
    return true;
  }
  
  // If we've hit the max recreations, only allow one per minute
  if (gridManager.totalCreations >= gridManager.maxRecreations && 
      (now - gridManager.lastCreationTime < gridManager.minRecreationInterval)) {
    return true;
  }
  
  return false;
};

/**
 * Check if dimensions have changed significantly enough to recreate grid
 * @param oldDimensions - Previous canvas dimensions
 * @param newDimensions - Current canvas dimensions
 * @returns Whether dimensions changed enough to recreate grid
 */
export const hasDimensionsChangedSignificantly = (
  oldDimensions: { width: number, height: number },
  newDimensions: { width: number, height: number }
): boolean => {
  // For first creation, always proceed
  if (oldDimensions.width === 0 || oldDimensions.height === 0) {
    return true;
  }
  
  // Calculate dimension changes as percentage
  const widthChange = Math.abs(oldDimensions.width - newDimensions.width) / oldDimensions.width;
  const heightChange = Math.abs(oldDimensions.height - newDimensions.height) / oldDimensions.height;
  
  // Only recreate grid if dimensions change by more than 10% (reduced threshold)
  return widthChange > 0.1 || heightChange > 0.1;
};

/**
 * Handle errors during grid creation
 * @param err - Error object
 * @param setHasError - Function to set error state
 * @param setErrorMessage - Function to set error message
 * @param gridManager - The grid manager instance
 * @returns Empty array for grid objects
 */
export const handleGridCreationError = (
  err: any,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void,
  gridManager: any
): any[] => {
  console.error("Error creating grid:", err);
  setHasError(true);
  setErrorMessage(`Failed to create grid: ${err instanceof Error ? err.message : String(err)}`);
  gridManager.inProgress = false;
  gridManager.batchTimeoutId = null;
  return [];
};

/**
 * Create grid in a batched operation
 * @param canvas - The Fabric canvas instance
 * @param gridLayerRef - Reference to store grid objects
 * @param canvasDimensions - Current canvas dimensions
 * @param setDebugInfo - Function to update debug info state
 * @param setHasError - Function to set error state
 * @param setErrorMessage - Function to set error message
 * @param now - Current timestamp
 * @param gridManager - The grid manager instance
 * @returns Array of created grid objects
 */
export const createGridBatch = (
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
  setErrorMessage: (value: string) => void,
  now: number,
  gridManager: any
): any[] => {
  console.log("Executing grid batch creation with critical debugging");
  
  try {
    // Tracking metric
    gridManager.totalCreations++;
    
    console.log(`Creating grid... (${gridManager.totalCreations})`);
    
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
    
    // Get up-to-date dimensions with safety checks
    const canvasWidth = Math.max(canvas.getWidth() || canvasDimensions.width, 400);
    const canvasHeight = Math.max(canvas.getHeight() || canvasDimensions.height, 300);
    
    console.log(`Canvas dimensions for grid creation: ${canvasWidth}x${canvasHeight}`);
    
    // Store the current dimensions for future comparison
    gridManager.lastDimensions = { width: canvasWidth, height: canvasHeight };
    
    // Render all grid components with explicit error handling
    console.log("Starting renderGridComponents...");
    const result = renderGridComponents(
      canvas, 
      canvasWidth, 
      canvasHeight
    );
    
    if (result.gridObjects.length === 0) {
      console.warn("No grid objects were created - critical failure");
      // Try again with hardcoded fallback dimensions if needed
      if (canvasWidth === 0 || canvasHeight === 0) {
        console.log("Attempting grid creation with fallback dimensions");
        const fallbackResult = renderGridComponents(canvas, 800, 600);
        if (fallbackResult.gridObjects.length > 0) {
          console.log("Fallback grid creation succeeded");
          arrangeGridObjects(
            canvas, 
            fallbackResult.smallGridLines, 
            fallbackResult.largeGridLines, 
            fallbackResult.markers
          );
          gridLayerRef.current = fallbackResult.gridObjects;
          gridManager.exists = true;
          setDebugInfo(prev => ({...prev, gridCreated: true}));
          return fallbackResult.gridObjects;
        }
      }
    } else {
      console.log(`Grid objects created: ${result.gridObjects.length}`);
    }
    
    // Arrange grid objects in the correct z-order
    console.log("Arranging grid objects...");
    arrangeGridObjects(canvas, result.smallGridLines, result.largeGridLines, result.markers);
    
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
    setHasError(false);
    
    // Update the last creation time
    gridManager.lastCreationTime = now;
    gridManager.initialized = true;
    
    return result.gridObjects;
  } catch (error) {
    console.error("Critical error in createGridBatch:", error);
    setHasError(true);
    setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
    gridManager.inProgress = false;
    gridManager.batchTimeoutId = null;
    return [];
  } finally {
    gridManager.inProgress = false;
    gridManager.batchTimeoutId = null;
    console.log("Grid batch creation process complete");
  }
};
