
/**
 * Grid debugging and utility functions
 * Provides utilities for diagnosing and fixing grid-related issues
 * @module grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { 
  LARGE_GRID, 
  LARGE_GRID_LINE_WIDTH 
} from "@/constants/numerics";
import logger from "@/utils/logger";

/**
 * Dump grid state to console for debugging
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export function dumpGridState(
  canvas: FabricCanvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
) {
  if (!canvas) {
    console.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  // Log general canvas state
  console.log("Canvas state:", {
    width: canvas.width,
    height: canvas.height,
    objectCount: canvas.getObjects().length,
    gridObjectCount: gridLayerRef.current.length
  });
  
  // Check grid integrity
  const gridObjects = gridLayerRef.current;
  const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  
  console.log("Grid integrity:", {
    totalGridObjects: gridObjects.length,
    gridObjectsOnCanvas: gridOnCanvas.length,
    missingObjects: gridObjects.length - gridOnCanvas.length
  });
  
  // Log any issues
  if (gridObjects.length === 0) {
    console.warn("No grid objects found in gridLayerRef");
  }
  
  if (gridObjects.length > 0 && gridOnCanvas.length === 0) {
    console.error("All grid objects are missing from canvas");
  }
  
  if (gridObjects.length !== gridOnCanvas.length) {
    console.warn(`${gridObjects.length - gridOnCanvas.length} grid objects missing from canvas`);
  }
}

/**
 * Attempt to recover grid when validation fails
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {Function | null} createGridFn - Optional custom grid creation function
 * @returns {boolean} Whether recovery was successful
 */
export function attemptGridRecovery(
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn: ((canvas: FabricCanvas) => FabricObject[]) | null = null
): boolean {
  logger.info("Attempting grid recovery");
  
  try {
    // First, clean up existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Try using provided creation function first
    if (typeof createGridFn === 'function') {
      const newGrid = createGridFn(canvas);
      if (newGrid && newGrid.length > 0) {
        gridLayerRef.current = newGrid;
        canvas.requestRenderAll();
        logger.info(`Grid recovered with ${newGrid.length} objects from custom creation function`);
        return true;
      }
    }
    
    // If that fails, create a basic grid manually
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridLines: FabricObject[] = [];
    
    // Create a minimal set of horizontal and vertical lines
    for (let i = 0; i <= width; i += LARGE_GRID) {
      const line = new Line([i, 0, i, height], {
        stroke: 'rgba(150, 150, 150, 0.4)',
        strokeWidth: LARGE_GRID_LINE_WIDTH,
        selectable: false,
        evented: false
      });
      
      gridLines.push(line);
      canvas.add(line);
    }
    
    for (let i = 0; i <= height; i += LARGE_GRID) {
      const line = new Line([0, i, width, i], {
        stroke: 'rgba(150, 150, 150, 0.4)',
        strokeWidth: LARGE_GRID_LINE_WIDTH,
        selectable: false,
        evented: false
      });
      
      gridLines.push(line);
      canvas.add(line);
    }
    
    // Update reference
    gridLayerRef.current = gridLines;
    
    // Force a render
    canvas.requestRenderAll();
    
    logger.info(`Grid recovered with ${gridLines.length} manual grid lines`);
    return gridLines.length > 0;
  } catch (error) {
    logger.error("Grid recovery failed:", error);
    return false;
  }
}

/**
 * Force creation of a grid with highest priority
 * Last resort for grid creation when all other methods fail
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether force creation was successful
 */
export function forceCreateGrid(
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean {
  logger.warn("FORCE CREATING EMERGENCY GRID");
  console.warn("🚨 Force creating emergency grid - all other methods failed");
  
  try {
    // Clean existing grid
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
    
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Create emergency grid with very few lines to ensure it works
    const gridLines: FabricObject[] = [];
    
    // Create only a few grid lines (5x5 grid)
    const spacing = Math.min(width, height) / 5;
    
    for (let i = 0; i <= width; i += spacing) {
      const line = new Line([i, 0, i, height], {
        stroke: 'rgba(255, 0, 0, 0.3)',
        strokeWidth: 2,
        selectable: false,
        evented: false
      });
      
      gridLines.push(line);
      canvas.add(line);
    }
    
    for (let i = 0; i <= height; i += spacing) {
      const line = new Line([0, i, width, i], {
        stroke: 'rgba(255, 0, 0, 0.3)',
        strokeWidth: 2,
        selectable: false,
        evented: false
      });
      
      gridLines.push(line);
      canvas.add(line);
    }
    
    // Update reference
    gridLayerRef.current = gridLines;
    
    // Force render
    canvas.renderAll();
    
    logger.info(`Emergency grid created with ${gridLines.length} lines`);
    return true;
  } catch (error) {
    logger.error("Even emergency grid creation failed:", error);
    console.error("💥 Critical failure: Even emergency grid creation failed:", error);
    return false;
  }
}
