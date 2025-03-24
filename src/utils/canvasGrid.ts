
/**
 * Utility functions for creating and managing the canvas grid
 * Provides a visual reference for drawing to scale
 * @module canvasGrid
 */
import { Canvas, Line, Text } from "fabric";
import { SMALL_GRID, LARGE_GRID } from "@/utils/drawing";

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
  console.log("Creating grid...");
  
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
      return [];
    }
    
    // Disable rendering during batch operations for performance
    canvas.renderOnAddRemove = false;
    
    // Optimized: Reduce small grid density based on canvas size
    // Show fewer small grid lines for better performance
    const smallGridStep = SMALL_GRID;
    const maxSmallGridLines = 100; // Reduced from 200 for better performance
    
    // Optimize by creating grid lines only within viewport
    // and at a density appropriate for the current zoom level
    let smallGridCount = 0;
    const smallGridSkip = Math.max(1, Math.round((canvasWidth * canvasHeight) / 400000)); // Dynamic skip factor
    
    for (let i = 0; i < canvasWidth && smallGridCount < maxSmallGridLines; i += smallGridStep * smallGridSkip) {
      const smallGridLine = new Line([i, 0, i, canvasHeight], {
        stroke: "#E6F3F8",
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        objectCaching: true,
        hoverCursor: 'default'
      });
      canvas.add(smallGridLine);
      gridObjects.push(smallGridLine);
      smallGridCount++;
    }
    
    for (let i = 0; i < canvasHeight && smallGridCount < maxSmallGridLines; i += smallGridStep * smallGridSkip) {
      const smallGridLine = new Line([0, i, canvasWidth, i], {
        stroke: "#E6F3F8",
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        objectCaching: true,
        hoverCursor: 'default'
      });
      canvas.add(smallGridLine);
      gridObjects.push(smallGridLine);
      smallGridCount++;
    }

    // Large grid lines (1m) - these are important for visual reference
    const largeGridStep = LARGE_GRID;
    for (let i = 0; i < canvasWidth; i += largeGridStep) {
      const largeGridLine = new Line([i, 0, i, canvasHeight], {
        stroke: "#C2E2F3",
        selectable: false,
        evented: false,
        strokeWidth: 1,
        objectCaching: true,
        hoverCursor: 'default'
      });
      canvas.add(largeGridLine);
      gridObjects.push(largeGridLine);
    }
    
    for (let i = 0; i < canvasHeight; i += largeGridStep) {
      const largeGridLine = new Line([0, i, canvasWidth, i], {
        stroke: "#C2E2F3",
        selectable: false,
        evented: false,
        strokeWidth: 1,
        objectCaching: true,
        hoverCursor: 'default'
      });
      canvas.add(largeGridLine);
      gridObjects.push(largeGridLine);
    }

    // Add scale marker (1m)
    const markerLine = new Line([
      canvasWidth - largeGridStep - 20, 
      canvasHeight - 20, 
      canvasWidth - 20, 
      canvasHeight - 20
    ], {
      stroke: "#333333",
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    const markerText = new Text("1m", {
      left: canvasWidth - largeGridStep/2 - 30,
      top: canvasHeight - 35,
      fontSize: 12,
      fill: "#333333",
      selectable: false,
      evented: false,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    canvas.add(markerLine);
    canvas.add(markerText);
    gridObjects.push(markerLine);
    gridObjects.push(markerText);
    
    // Re-enable rendering and render all at once
    canvas.renderOnAddRemove = true;
    
    // Send all grid objects to the back
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Store grid objects in the reference for later use
    gridLayerRef.current = gridObjects;
    canvas.renderAll();
    
    setDebugInfo(prev => ({...prev, gridCreated: true}));
    setHasError(false);
    
    console.log(`Grid created with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (err) {
    console.error("Error creating grid:", err);
    setHasError(true);
    setErrorMessage(`Failed to create grid: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
};
