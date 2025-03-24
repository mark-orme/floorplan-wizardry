
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
// Store the last dimensions that were used to create a grid
let lastGridDimensions = { width: 0, height: 0 };
// Track if grid has been created at all
let gridInitialized = false;

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
    // Don't log to avoid console spam
    return gridLayerRef.current;
  }
  
  // If grid already exists, don't recreate unless dimensions change significantly
  if (gridInitialized && gridLayerRef.current.length > 0) {
    // Calculate dimension changes as percentage
    const widthChange = Math.abs(lastGridDimensions.width - canvasDimensions.width) / lastGridDimensions.width;
    const heightChange = Math.abs(lastGridDimensions.height - canvasDimensions.height) / lastGridDimensions.height;
    
    // Only recreate grid if dimensions change by more than 20%
    if (widthChange < 0.2 && heightChange < 0.2) {
      // Silently reuse existing grid - no log to reduce console spam
      return gridLayerRef.current;
    }
  }
  
  // ANTI-FLICKER: Enforce a minimum time between grid refreshes (increased to 10 seconds)
  const now = Date.now();
  if (now - lastGridCreationTime < 10000 && gridLayerRef.current.length > 0) {
    // Silently reuse existing grid - no log to reduce console spam
    return gridLayerRef.current;
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
    
    // Store the current dimensions for future comparison
    lastGridDimensions = { width: canvasWidth, height: canvasHeight };
    
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
    gridInitialized = true;
    
    return gridObjects;
  } catch (err) {
    console.error("Error creating grid:", err);
    setHasError(true);
    setErrorMessage(`Failed to create grid: ${err instanceof Error ? err.message : String(err)}`);
    gridCreationInProgress = false;
    return [];
  }
};
