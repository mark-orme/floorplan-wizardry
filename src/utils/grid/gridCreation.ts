
/**
 * Grid creation utilities for canvas
 * Provides functions to create grid lines on the canvas
 * @module grid/gridCreation
 */
import { Canvas, Line, Object as FabricObject } from "fabric";
import { throttledLog } from "./consoleThrottling";

/**
 * Grid creation configuration options
 * @interface GridLineOptions
 */
interface GridLineOptions {
  /** Color of grid lines */
  color: string;
  /** Width of grid lines */
  width: number;
  /** Whether grid lines are selectable */
  selectable: boolean;
  /** Type of grid lines (small or large) */
  type: "small" | "large";
}

/**
 * Constants for grid creation
 */
const GRID_CONSTANTS = {
  /**
   * Small grid spacing in canvas units
   * @constant {number}
   */
  SMALL_GRID_SPACING: 10,
  
  /**
   * Large grid spacing in canvas units
   * @constant {number}
   */
  LARGE_GRID_SPACING: 100,
  
  /**
   * Default small grid color
   * @constant {string}
   */
  SMALL_GRID_COLOR: "#e0e0e0",
  
  /**
   * Default large grid color
   * @constant {string}
   */
  LARGE_GRID_COLOR: "#b0b0b0",
  
  /**
   * Small grid line width
   * @constant {number}
   */
  SMALL_GRID_WIDTH: 0.5,
  
  /**
   * Large grid line width
   * @constant {number}
   */
  LARGE_GRID_WIDTH: 1
};

/**
 * Create small scale grid lines
 * Creates a grid with 10px spacing
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {GridLineOptions} options - Grid line configuration
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createSmallScaleGrid(
  canvas: Canvas,
  options: GridLineOptions
): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    throw new Error("Invalid canvas for grid creation");
  }
  
  const gridObjects: FabricObject[] = [];
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const { color, width, selectable, type } = options;
  
  // Create horizontal lines
  for (let y = 0; y <= canvasHeight; y += GRID_CONSTANTS.SMALL_GRID_SPACING) {
    const line = new Line([0, y, canvasWidth, y], {
      stroke: color,
      strokeWidth: width,
      selectable,
      evented: false,
      excludeFromExport: true,
      name: `grid-${type}-h-${y}`
    });
    
    canvas.add(line);
    gridObjects.push(line);
    
    // Send to back to ensure grid is behind all objects
    canvas.sendObjectToBack(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= canvasWidth; x += GRID_CONSTANTS.SMALL_GRID_SPACING) {
    const line = new Line([x, 0, x, canvasHeight], {
      stroke: color,
      strokeWidth: width,
      selectable,
      evented: false,
      excludeFromExport: true,
      name: `grid-${type}-v-${x}`
    });
    
    canvas.add(line);
    gridObjects.push(line);
    
    // Send to back to ensure grid is behind all objects
    canvas.sendObjectToBack(line);
  }
  
  return gridObjects;
}

/**
 * Create large scale grid lines
 * Creates a grid with 100px spacing
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {GridLineOptions} options - Grid line configuration 
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createLargeScaleGrid(
  canvas: Canvas,
  options: GridLineOptions
): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    throw new Error("Invalid canvas for grid creation");
  }
  
  const gridObjects: FabricObject[] = [];
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const { color, width, selectable, type } = options;
  
  // Create horizontal lines
  for (let y = 0; y <= canvasHeight; y += GRID_CONSTANTS.LARGE_GRID_SPACING) {
    const line = new Line([0, y, canvasWidth, y], {
      stroke: color,
      strokeWidth: width,
      selectable,
      evented: false,
      excludeFromExport: true,
      name: `grid-${type}-h-${y}`
    });
    
    canvas.add(line);
    gridObjects.push(line);
    
    // Send to back to ensure grid is behind all objects
    canvas.sendObjectToBack(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= canvasWidth; x += GRID_CONSTANTS.LARGE_GRID_SPACING) {
    const line = new Line([x, 0, x, canvasHeight], {
      stroke: color,
      strokeWidth: width,
      selectable,
      evented: false,
      excludeFromExport: true,
      name: `grid-${type}-v-${x}`
    });
    
    canvas.add(line);
    gridObjects.push(line);
    
    // Send to back to ensure grid is behind all objects
    canvas.sendObjectToBack(line);
  }
  
  return gridObjects;
}

/**
 * Create a complete grid with both small and large scale lines
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createGridLayer(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  try {
    throttledLog("Creating complete grid with small and large scale lines");
    
    // Clear any existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create small scale grid
    const smallGridOptions: GridLineOptions = {
      color: GRID_CONSTANTS.SMALL_GRID_COLOR,
      width: GRID_CONSTANTS.SMALL_GRID_WIDTH,
      selectable: false,
      type: "small"
    };
    
    const smallGridObjects = createSmallScaleGrid(canvas, smallGridOptions);
    
    // Create large scale grid
    const largeGridOptions: GridLineOptions = {
      color: GRID_CONSTANTS.LARGE_GRID_COLOR,
      width: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      type: "large"
    };
    
    const largeGridObjects = createLargeScaleGrid(canvas, largeGridOptions);
    
    // Combine all grid objects
    const allGridObjects = [...smallGridObjects, ...largeGridObjects];
    
    // Update reference
    gridLayerRef.current = allGridObjects;
    
    // Force render
    canvas.requestRenderAll();
    
    return allGridObjects;
  } catch (error) {
    console.error("Error creating grid layer:", error);
    throw error;
  }
}

/**
 * Create a fallback grid with minimal lines
 * Used when the regular grid creation fails
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createFallbackGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  try {
    throttledLog("Creating emergency fallback grid");
    
    // Clear any existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Create just a few horizontal lines for the emergency grid
    for (let y = 0; y <= canvasHeight; y += GRID_CONSTANTS.LARGE_GRID_SPACING * 2) {
      const line = new Line([0, y, canvasWidth, y], {
        stroke: "#c0c0c0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        name: `grid-emergency-h-${y}`
      });
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create just a few vertical lines for the emergency grid
    for (let x = 0; x <= canvasWidth; x += GRID_CONSTANTS.LARGE_GRID_SPACING * 2) {
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: "#c0c0c0",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        name: `grid-emergency-v-${x}`
      });
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    // Update reference
    gridLayerRef.current = gridObjects;
    
    // Force render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating fallback grid:", error);
    // Return empty array as last resort
    return [];
  }
}

/**
 * Basic functionality for creating grid
 * Used when the complete grid creation fails
 */
export function createBasicEmergencyGrid(
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  // Same functionality as fallback grid but with even fewer lines
  try {
    throttledLog("Creating basic emergency grid");
    
    // Clear any existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Create center lines only
    const horizontalLine = new Line([0, canvasHeight / 2, canvasWidth, canvasHeight / 2], {
      stroke: "#a0a0a0",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      name: "grid-emergency-center-h"
    });
    
    const verticalLine = new Line([canvasWidth / 2, 0, canvasWidth / 2, canvasHeight], {
      stroke: "#a0a0a0",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      name: "grid-emergency-center-v"
    });
    
    canvas.add(horizontalLine);
    canvas.add(verticalLine);
    
    gridObjects.push(horizontalLine, verticalLine);
    
    // Update reference
    gridLayerRef.current = gridObjects;
    
    // Force render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Even basic emergency grid failed:", error);
    return [];
  }
}
