
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
 * Creates small grid lines
 * Creates a network of thin grid lines at SMALL_GRID intervals (typically 0.1m)
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
    console.log("Creating small grid lines");
  }
  
  const smallGridObjects: Line[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Invalid canvas dimensions for small grid:", canvasWidth, canvasHeight);
    }
    return smallGridObjects;
  }
  
  // Only skip small grid if dimensions are EXTREMELY large
  if (shouldSkipSmallGrid(canvasWidth, canvasHeight)) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Skipping small grid creation for performance - too many lines would be created");
    }
    return smallGridObjects;
  }
  
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
    // Create more visible lines with increased opacity and slightly darker color
    const smallGridLine = new Line([position, startY, position, endY], SMALL_GRID_LINE_OPTIONS);
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  // Create horizontal small grid lines
  for (let position = startY; position <= endY && smallGridCount < MAX_SMALL_GRID_LINES*2; position += smallGridStep) {
    const smallGridLine = new Line([startX, position, endX, position], SMALL_GRID_LINE_OPTIONS);
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Created ${smallGridObjects.length} small grid lines`);
  }
  
  return smallGridObjects;
};

/**
 * Creates large grid lines
 * Creates a network of thicker grid lines at LARGE_GRID intervals (typically 1m)
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
    console.log("Creating large grid lines");
  }
  
  const largeGridObjects: Line[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Invalid canvas dimensions for large grid:", canvasWidth, canvasHeight);
    }
    return largeGridObjects;
  }
  
  const largeGridStep = LARGE_GRID;
  let largeGridCount = 0;
  
  // Extended grid coverage
  const extensionFactor = GRID_EXTENSION_FACTOR;
  const extendedWidth = canvasWidth * extensionFactor;
  const extendedHeight = canvasHeight * extensionFactor;
  
  // Adjust grid offset to fill the canvas completely
  const startX = -canvasWidth * GRID_OFFSET_FACTOR; // Using constant instead of magic 1/4
  const startY = -canvasHeight * GRID_OFFSET_FACTOR; // Using constant instead of magic 1/4
  const endX = extendedWidth;
  const endY = extendedHeight;
  
  // Create vertical large grid lines
  for (let position = startX; position <= endX && largeGridCount < MAX_LARGE_GRID_LINES; position += largeGridStep) {
    const largeGridLine = new Line([position, startY, position, endY], LARGE_GRID_LINE_OPTIONS);
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  // Create horizontal large grid lines
  for (let position = startY; position <= endY && largeGridCount < MAX_LARGE_GRID_LINES; position += largeGridStep) {
    const largeGridLine = new Line([startX, position, endX, position], LARGE_GRID_LINE_OPTIONS);
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Created ${largeGridObjects.length} large grid lines`);
  }
  
  return largeGridObjects;
};
