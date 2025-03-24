
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
    
    // OPTIMIZATION: Batch add grid objects for better performance
    const gridBatch: any[] = [];
    
    // Further reduce small grid density for larger canvases
    // Dynamically adjust grid density based on canvas size
    const smallGridStep = SMALL_GRID;
    const maxSmallGridLines = 80; // Reduced for better performance
    
    // Use smarter skip calculation based on canvas dimensions
    const canvasArea = canvasWidth * canvasHeight;
    const smallGridSkip = Math.max(1, Math.floor(Math.sqrt(canvasArea) / 200));
    
    // OPTIMIZATION: Pre-calculate gridlines count to avoid unnecessary creation
    const estimatedLinesX = Math.ceil(canvasWidth / (smallGridStep * smallGridSkip));
    const estimatedLinesY = Math.ceil(canvasHeight / (smallGridStep * smallGridSkip));
    const totalEstimatedLines = estimatedLinesX + estimatedLinesY;
    
    // Skip creating small grid entirely if it would create too many lines
    const skipSmallGrid = totalEstimatedLines > maxSmallGridLines * 3;
    
    let smallGridCount = 0;
    
    if (!skipSmallGrid) {
      // Create vertical small grid lines
      for (let i = 0; i < canvasWidth && smallGridCount < maxSmallGridLines; i += smallGridStep * smallGridSkip) {
        const smallGridLine = new Line([i, 0, i, canvasHeight], {
          stroke: "#E6F3F8",
          selectable: false,
          evented: false,
          strokeWidth: 0.5,
          objectCaching: true,
          hoverCursor: 'default'
        });
        gridBatch.push(smallGridLine);
        gridObjects.push(smallGridLine);
        smallGridCount++;
      }
      
      // Create horizontal small grid lines
      for (let i = 0; i < canvasHeight && smallGridCount < maxSmallGridLines; i += smallGridStep * smallGridSkip) {
        const smallGridLine = new Line([0, i, canvasWidth, i], {
          stroke: "#E6F3F8",
          selectable: false,
          evented: false,
          strokeWidth: 0.5,
          objectCaching: true,
          hoverCursor: 'default'
        });
        gridBatch.push(smallGridLine);
        gridObjects.push(smallGridLine);
        smallGridCount++;
      }
    } else {
      console.log("Skipping small grid creation for performance - too many lines would be created");
    }

    // Large grid lines (1m) - these are important for visual reference
    // OPTIMIZATION: Also limit large grid lines on very large canvases
    const largeGridStep = LARGE_GRID;
    const maxLargeGridLines = 50; // Safety limit
    
    let largeGridCount = 0;
    const largeGridSkip = Math.max(1, Math.floor(Math.sqrt(canvasArea) / 1000));
    
    // Create vertical large grid lines
    for (let i = 0; i < canvasWidth && largeGridCount < maxLargeGridLines; i += largeGridStep * largeGridSkip) {
      const largeGridLine = new Line([i, 0, i, canvasHeight], {
        stroke: "#C2E2F3",
        selectable: false,
        evented: false,
        strokeWidth: 1,
        objectCaching: true,
        hoverCursor: 'default'
      });
      gridBatch.push(largeGridLine);
      gridObjects.push(largeGridLine);
      largeGridCount++;
    }
    
    // Create horizontal large grid lines
    for (let i = 0; i < canvasHeight && largeGridCount < maxLargeGridLines; i += largeGridStep * largeGridSkip) {
      const largeGridLine = new Line([0, i, canvasWidth, i], {
        stroke: "#C2E2F3",
        selectable: false,
        evented: false,
        strokeWidth: 1,
        objectCaching: true,
        hoverCursor: 'default'
      });
      gridBatch.push(largeGridLine);
      gridObjects.push(largeGridLine);
      largeGridCount++;
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
    
    gridBatch.push(markerLine);
    gridBatch.push(markerText);
    gridObjects.push(markerLine);
    gridObjects.push(markerText);
    
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
    
    // OPTIMIZATION: Throttle final render
    setTimeout(() => {
      canvas.requestRenderAll();
      console.log(`Grid created with ${gridObjects.length} objects (${smallGridCount} small, ${largeGridCount} large)`);
    }, 0);
    
    setDebugInfo(prev => ({...prev, gridCreated: true}));
    setHasError(false);
    
    return gridObjects;
  } catch (err) {
    console.error("Error creating grid:", err);
    setHasError(true);
    setErrorMessage(`Failed to create grid: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
};
