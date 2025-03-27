
/**
 * Grid creation utilities module
 * Provides functions for creating grid elements
 * @module grid/gridCreation
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";
import { SMALL_GRID_LINE_OPTIONS, LARGE_GRID_LINE_OPTIONS } from "../gridConstants";
import { GridLineOptions } from "./typeUtils";

/**
 * Creates a basic grid with given parameters
 * @param {Canvas} canvas - The fabric canvas
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} gridSpacing - Grid spacing
 * @param {GridLineOptions} lineOptions - Line style options
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicGrid = (
  canvas: Canvas,
  width: number,
  height: number,
  gridSpacing: number,
  lineOptions: GridLineOptions
): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  // Validate parameters
  if (!canvas || typeof width !== 'number' || typeof height !== 'number' || 
      width <= 0 || height <= 0 || typeof gridSpacing !== 'number' || gridSpacing <= 0) {
    logger.error("Invalid parameters for createBasicGrid");
    console.error("Grid creation error: Invalid parameters", { width, height, gridSpacing });
    return gridObjects;
  }
  
  try {
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSpacing) {
      const line = new Line([x, 0, x, height], {
        ...lineOptions,
        objectType: 'grid', // Mark as grid object for easier identification
      });
      canvas.add(line); // Add to canvas immediately
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSpacing) {
      const line = new Line([0, y, width, y], {
        ...lineOptions,
        objectType: 'grid', // Mark as grid object
      });
      canvas.add(line); // Add to canvas immediately
      gridObjects.push(line);
    }
    
    // Log success
    console.log(`Created grid with ${gridObjects.length} lines (spacing: ${gridSpacing}px)`);
    
    // Send grid objects to back
    gridObjects.forEach(obj => canvas.sendObjectToBack(obj));
    
    // Force a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid:", error);
    console.error("Grid creation error:", error);
    return gridObjects;
  }
};

/**
 * Creates a small-scale grid (0.1m spacing)
 * @param {Canvas} canvas - The fabric canvas
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {FabricObject[]} Created small grid objects
 */
export const createSmallScaleGrid = (
  canvas: Canvas,
  width: number,
  height: number
): FabricObject[] => {
  // Use the standard small grid spacing (10px = 0.1m)
  const gridSpacing = 10;
  
  // Validate canvas
  if (!canvas) {
    logger.error("Invalid canvas for createSmallScaleGrid");
    return [];
  }
  
  console.log("Creating small scale grid with spacing:", gridSpacing);
  
  // Validate dimensions
  const validWidth = typeof width === 'number' && width > 0 ? width : canvas.width || 800;
  const validHeight = typeof height === 'number' && height > 0 ? height : canvas.height || 600;
  
  return createBasicGrid(canvas, validWidth, validHeight, gridSpacing, SMALL_GRID_LINE_OPTIONS);
};

/**
 * Creates a large-scale grid (1m spacing)
 * @param {Canvas} canvas - The fabric canvas
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {FabricObject[]} Created large grid objects
 */
export const createLargeScaleGrid = (
  canvas: Canvas,
  width: number,
  height: number
): FabricObject[] => {
  // Use the standard large grid spacing (100px = 1m)
  const gridSpacing = 100;
  
  // Validate canvas
  if (!canvas) {
    logger.error("Invalid canvas for createLargeScaleGrid");
    return [];
  }
  
  console.log("Creating large scale grid with spacing:", gridSpacing);
  
  // Validate dimensions
  const validWidth = typeof width === 'number' && width > 0 ? width : canvas.width || 800;
  const validHeight = typeof height === 'number' && height > 0 ? height : canvas.height || 600;
  
  return createBasicGrid(canvas, validWidth, validHeight, gridSpacing, LARGE_GRID_LINE_OPTIONS);
};

/**
 * Creates a complete grid with both small and large scale lines
 * @param {Canvas} canvas - The fabric canvas
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {{smallGrid: FabricObject[], largeGrid: FabricObject[], allGrid: FabricObject[]}} Created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas,
  width: number,
  height: number
): {smallGrid: FabricObject[], largeGrid: FabricObject[], allGrid: FabricObject[]} => {
  console.log("Creating complete grid system with dimensions:", { width, height });
  
  // Create small grid first (will be in the background)
  const smallGrid = createSmallScaleGrid(canvas, width, height);
  
  // Create large grid on top
  const largeGrid = createLargeScaleGrid(canvas, width, height);
  
  // Combine all grid objects
  const allGrid = [...smallGrid, ...largeGrid];
  
  // Ensure grid objects are in the background
  // Small grid goes furthest back, large grid on top of small grid
  smallGrid.forEach(obj => canvas.sendObjectToBack(obj));
  
  // Force a render
  canvas.requestRenderAll();
  
  return { 
    smallGrid, 
    largeGrid, 
    allGrid 
  };
};
