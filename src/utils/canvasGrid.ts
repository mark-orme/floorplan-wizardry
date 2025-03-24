
/**
 * Canvas grid creation module
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas } from "fabric";
import { gridManager, shouldThrottleGridCreation, hasDimensionsChangedSignificantly } from "./gridManager";
import { renderGridComponents, arrangeGridObjects } from "./gridRenderer";

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
  // If grid already exists, don't create a new one
  if (gridManager.exists && gridLayerRef.current.length > 0) {
    // Check if grid objects are still on the canvas
    const gridOnCanvas = gridLayerRef.current.some(obj => canvas.contains(obj));
    
    if (gridOnCanvas) {
      return gridLayerRef.current;
    }
  }
  
  // Prevent multiple concurrent grid creations
  if (gridManager.inProgress) {
    return gridLayerRef.current;
  }
  
  // If grid already exists, don't recreate unless dimensions change significantly
  if (gridManager.initialized && gridLayerRef.current.length > 0) {
    if (!hasDimensionsChangedSignificantly(gridManager.lastDimensions, canvasDimensions)) {
      return gridLayerRef.current;
    }
  }
  
  // Enforce throttling limits
  const now = Date.now();
  if (shouldThrottleGridCreation(now)) {
    return gridLayerRef.current;
  }
  
  // Batch concurrent requests in a single operation
  if (gridManager.batchTimeoutId) {
    clearTimeout(gridManager.batchTimeoutId);
  }
  
  gridManager.inProgress = true;
  
  // Use a timeout to batch rapid calls
  gridManager.batchTimeoutId = window.setTimeout(() => {
    try {
      // Tracking metric
      gridManager.totalCreations++;
      
      // Only log first grid creation and every 3rd after that
      if (gridManager.totalCreations === 1 || gridManager.totalCreations % 3 === 0) {
        console.log(`Creating grid... (${gridManager.totalCreations})`);
      }
      
      // Remove existing grid objects if any
      if (gridLayerRef.current.length > 0) {
        const existingObjects = [...gridLayerRef.current];
        existingObjects.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      const canvasWidth = canvas.getWidth() || canvasDimensions.width;
      const canvasHeight = canvas.getHeight() || canvasDimensions.height;
      
      // Store the current dimensions for future comparison
      gridManager.lastDimensions = { width: canvasWidth, height: canvasHeight };
      
      if (canvasWidth <= 0 || canvasHeight <= 0) {
        setHasError(true);
        setErrorMessage("Invalid canvas dimensions");
        gridManager.inProgress = false;
        gridManager.batchTimeoutId = null;
        return [];
      }
      
      // Render all grid components
      const { gridObjects, smallGridLines, largeGridLines, markers } = renderGridComponents(
        canvas, 
        canvasWidth, 
        canvasHeight
      );
      
      // Arrange grid objects in the correct z-order
      arrangeGridObjects(canvas, smallGridLines, largeGridLines, markers);
      
      // Store grid objects in the reference for later use
      gridLayerRef.current = gridObjects;
      
      // Set the grid exists flag
      gridManager.exists = true;
      
      // Only log detailed grid info on first creation
      if (gridManager.totalCreations === 1 || gridManager.totalCreations % 3 === 0) {
        console.log(`Grid created with ${gridObjects.length} objects (${smallGridLines.length} small, ${largeGridLines.length} large)`);
      }
      
      // One-time render
      canvas.requestRenderAll();
      
      setDebugInfo(prev => ({...prev, gridCreated: true}));
      setHasError(false);
      
      // Update the last creation time
      gridManager.lastCreationTime = now;
      gridManager.initialized = true;
      
      return gridObjects;
    } catch (err) {
      console.error("Error creating grid:", err);
      setHasError(true);
      setErrorMessage(`Failed to create grid: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    } finally {
      gridManager.inProgress = false;
      gridManager.batchTimeoutId = null;
    }
  }, 100);
  
  return gridLayerRef.current;
};
