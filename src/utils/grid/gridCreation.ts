
/**
 * Grid creation utilities module
 * Provides functions for creating grid elements
 * @module grid/gridCreation
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";
import { SMALL_GRID_LINE_OPTIONS, LARGE_GRID_LINE_OPTIONS } from "../gridConstants";

/**
 * Creates a basic grid with given parameters
 * @param {Canvas} canvas - The fabric canvas
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} gridSpacing - Grid spacing
 * @param {Object} lineOptions - Line style options
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicGrid = (
  canvas: Canvas,
  width: number,
  height: number,
  gridSpacing: number,
  lineOptions: any
): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas || width <= 0 || height <= 0) {
    logger.error("Invalid parameters for createBasicGrid");
    return gridObjects;
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += gridSpacing) {
    const line = new Line([x, 0, x, height], lineOptions);
    gridObjects.push(line);
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSpacing) {
    const line = new Line([0, y, width, y], lineOptions);
    gridObjects.push(line);
  }
  
  return gridObjects;
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
  // Use the standard small grid spacing (typically 10px = 0.1m)
  const gridSpacing = 10;
  return createBasicGrid(canvas, width, height, gridSpacing, SMALL_GRID_LINE_OPTIONS);
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
  // Use the standard large grid spacing (typically 100px = 1m)
  const gridSpacing = 100;
  return createBasicGrid(canvas, width, height, gridSpacing, LARGE_GRID_LINE_OPTIONS);
};
