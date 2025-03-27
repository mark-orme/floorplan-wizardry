
/**
 * Functions for creating different types of grid lines
 * @module gridCreators
 */
import { Canvas, Line } from "fabric";
import { 
  MAX_SMALL_GRID_LINES, 
  MAX_LARGE_GRID_LINES,
  GRID_EXTENSION_FACTOR,
  SMALL_GRID,
  LARGE_GRID
} from "@/constants/numerics";
import { 
  shouldSkipSmallGrid,
  SMALL_GRID_LINE_OPTIONS,
  LARGE_GRID_LINE_OPTIONS
} from "./gridConstants";
import { GRID_OFFSET_FACTOR } from "./grid/gridPositioningConstants";

/**
 * Creates small grid lines (0.1m spacing)
 * Creates a network of thin grid lines at SMALL_GRID intervals (0.1m)
 * These lines provide precise alignment guides for drawing
 * 
 * @param canvas - The Fabric canvas instance
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns Array of created small grid lines
 */
export const createSmallGrid = (
  canvas: Canvas,
  canvasWidth: number,
  canvasHeight: number
): Line[] => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Creating small grid lines (0.1m)");
  }
  
  const smallGridObjects: Line[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Invalid canvas dimensions for small grid:", canvasWidth, canvasHeight);
    }
    return smallGridObjects;
  }
  
  // Performance check for very large canvases
  if (shouldSkipSmallGrid(canvasWidth, canvasHeight)) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Skipping small grid creation for performance - too many lines would be created");
    }
    return smallGridObjects;
  }
  
  // Use SMALL_GRID (10px = 0.1m) for small grid
  const smallGridStep = SMALL_GRID;
  let smallGridCount = 0;
  
  // Extended grid coverage
  const extensionFactor = GRID_EXTENSION_FACTOR;
  const extendedWidth = canvasWidth * extensionFactor;
  const extendedHeight = canvasHeight * extensionFactor;
  
  // Adjust grid offset to fill the canvas completely
  const startX = -canvasWidth * GRID_OFFSET_FACTOR;
  const startY = -canvasHeight * GRID_OFFSET_FACTOR;
  const endX = extendedWidth;
  const endY = extendedHeight;
  
  // Create vertical small grid lines
  for (let position = startX; position <= endX && smallGridCount < MAX_SMALL_GRID_LINES; position += smallGridStep) {
    // Skip positions that would be created by large grid lines
    if (Math.abs(position % LARGE_GRID) < 0.1) continue;
    
    const smallGridLine = new Line([position, startY, position, endY], SMALL_GRID_LINE_OPTIONS);
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  // Create horizontal small grid lines
  for (let position = startY; position <= endY && smallGridCount < MAX_SMALL_GRID_LINES*2; position += smallGridStep) {
    // Skip positions that would be created by large grid lines
    if (Math.abs(position % LARGE_GRID) < 0.1) continue;
    
    const smallGridLine = new Line([startX, position, endX, position], SMALL_GRID_LINE_OPTIONS);
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Created ${smallGridObjects.length} small grid lines (0.1m spacing)`);
  }
  
  return smallGridObjects;
};

/**
 * Creates large grid lines (1.0m spacing)
 * Creates a network of thicker grid lines at LARGE_GRID intervals (1.0m)
 * These lines provide major alignment guides and improve distance perception
 * 
 * @param canvas - The Fabric canvas instance
 * @param canvasWidth - Canvas width in pixels
 * @param canvasHeight - Canvas height in pixels
 * @returns Array of created large grid lines
 */
export const createLargeGrid = (
  canvas: Canvas,
  canvasWidth: number,
  canvasHeight: number
): Line[] => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Creating large grid lines (1.0m)");
  }
  
  const largeGridObjects: Line[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Invalid canvas dimensions for large grid:", canvasWidth, canvasHeight);
    }
    return largeGridObjects;
  }
  
  // Use LARGE_GRID (100px = 1.0m) for large grid
  const largeGridStep = LARGE_GRID;
  let largeGridCount = 0;
  
  // Extended grid coverage
  const extensionFactor = GRID_EXTENSION_FACTOR;
  const extendedWidth = canvasWidth * extensionFactor;
  const extendedHeight = canvasHeight * extensionFactor;
  
  // Adjust grid offset to fill the canvas completely
  const startX = -canvasWidth * GRID_OFFSET_FACTOR;
  const startY = -canvasHeight * GRID_OFFSET_FACTOR;
  const endX = extendedWidth;
  const endY = extendedHeight;
  
  // Create vertical large grid lines (1.0m spacing)
  for (let position = Math.floor(startX / largeGridStep) * largeGridStep; 
       position <= endX && largeGridCount < MAX_LARGE_GRID_LINES; 
       position += largeGridStep) {
    
    const largeGridLine = new Line([position, startY, position, endY], LARGE_GRID_LINE_OPTIONS);
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  // Create horizontal large grid lines (1.0m spacing)
  for (let position = Math.floor(startY / largeGridStep) * largeGridStep; 
       position <= endY && largeGridCount < MAX_LARGE_GRID_LINES; 
       position += largeGridStep) {
    
    const largeGridLine = new Line([startX, position, endX, position], LARGE_GRID_LINE_OPTIONS);
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Created ${largeGridObjects.length} large grid lines (1.0m spacing)`);
  }
  
  return largeGridObjects;
};
