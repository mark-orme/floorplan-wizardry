
/**
 * Utility functions for creating and managing the canvas grid
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas } from "fabric";
import { createSmallGrid, createLargeGrid } from "./gridCreators";
import { createScaleMarkers } from "./gridUtils";

// Track last grid creation time globally to prevent excessive refreshes
let lastGridCreationTime = 0;
let gridCreationInProgress = false;

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
  // ANTI-FLICKER: Prevent multiple concurrent grid creations
  if (gridCreationInProgress) {
    console.log("Grid creation already in progress, skipping");
    return gridLayerRef.current;
  }
  
  // ANTI-FLICKER: Enforce a minimum time between grid refreshes (3 seconds)
  const now = Date.now();
  if (now - lastGridCreationTime < 3000 && gridLayerRef.current.length > 0) {
    console.log("Grid recently created, reusing existing grid");
    return gridLayerRef.current;
  }
  
  // Skip grid creation if already created with similar dimensions
  if (gridLayerRef.current.length > 0) {
    const existingGridDimensions = gridLayerRef.current.find(obj => obj.gridDimensions)?.gridDimensions;
    if (existingGridDimensions) {
      const widthDiff = Math.abs(existingGridDimensions.width - canvasDimensions.width);
      const heightDiff = Math.abs(existingGridDimensions.height - canvasDimensions.height);
      
      // If dimensions are similar (within 5%), just return existing grid
      if (widthDiff < canvasDimensions.width * 0.05 && heightDiff < canvasDimensions.height * 0.05) {
        console.log("Grid dimensions similar, reusing existing grid");
        return gridLayerRef.current;
      }
    }
  }
  
  console.log("Creating grid...");
  gridCreationInProgress = true;
  
  try {
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
    
    const gridObjects: any[] = [];
    const canvasWidth = canvas.getWidth() || canvasDimensions.width;
    const canvasHeight = canvas.getHeight() || canvasDimensions.height;
    
    console.log(`Canvas dimensions for grid: ${canvasWidth}x${canvasHeight}`);
    
    if (canvasWidth <= 0 || canvasHeight <= 0) {
      console.error("Invalid canvas dimensions for grid creation");
      setHasError(true);
      setErrorMessage("Invalid canvas dimensions");
      gridCreationInProgress = false;
      return [];
    }
    
    // Disable rendering during batch operations for performance
    canvas.renderOnAddRemove = false;
    
    // OPTIMIZATION: Batch add grid objects for better performance
    const gridBatch: any[] = [];
    
    // Create small grid lines
    const smallGridLines = createSmallGrid(canvas, canvasWidth, canvasHeight);
    smallGridLines.forEach(line => {
      gridBatch.push(line);
      gridObjects.push(line);
    });
    
    // Create large grid lines
    const largeGridLines = createLargeGrid(canvas, canvasWidth, canvasHeight);
    largeGridLines.forEach(line => {
      gridBatch.push(line);
      gridObjects.push(line);
    });

    // Add scale marker (1m)
    const markers = createScaleMarkers(canvas, canvasWidth, canvasHeight);
    markers.forEach(marker => {
      gridBatch.push(marker);
      gridObjects.push(marker);
    });
    
    // OPTIMIZATION: Add all grid objects at once in a batch for better performance
    canvas.add(...gridBatch);
    
    // Re-enable rendering and render all at once
    canvas.renderOnAddRemove = true;
    
    // Send all grid objects to the back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Store grid objects in the reference for later use
    gridLayerRef.current = gridObjects;
    
    // One-time render
    canvas.requestRenderAll();
    console.log(`Grid created with ${gridObjects.length} objects (${smallGridLines.length} small, ${largeGridLines.length} large)`);
    
    setDebugInfo(prev => ({...prev, gridCreated: true}));
    setHasError(false);
    
    // Update the last creation time
    lastGridCreationTime = now;
    gridCreationInProgress = false;
    
    return gridObjects;
  } catch (err) {
    console.error("Error creating grid:", err);
    setHasError(true);
    setErrorMessage(`Failed to create grid: ${err instanceof Error ? err.message : String(err)}`);
    gridCreationInProgress = false;
    return [];
  }
};
