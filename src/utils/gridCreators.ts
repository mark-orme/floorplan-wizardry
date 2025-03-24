
/**
 * Functions for creating different types of grid lines
 * @module gridCreators
 */
import { Canvas, Line } from "fabric";
import { 
  MAX_SMALL_GRID_LINES, 
  MAX_LARGE_GRID_LINES,
  shouldSkipSmallGrid,
  GRID_EXTENSION_FACTOR
} from "./gridConstants";
import { 
  calculateSmallGridSkip, 
  calculateLargeGridSkip 
} from "./gridUtils";
import { SMALL_GRID, LARGE_GRID } from "./drawing";

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
  // Reduced this threshold to make it less likely to skip
  if (canvasWidth * canvasHeight > 5000000) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Skipping small grid creation for performance - too many lines would be created");
    }
    return smallGridObjects;
  }
  
  const smallGridStep = SMALL_GRID;
  let smallGridCount = 0;
  
  // Extended grid coverage with better visibility
  const extensionFactor = GRID_EXTENSION_FACTOR;
  const extendedWidth = canvasWidth * extensionFactor;
  const extendedHeight = canvasHeight * extensionFactor;
  const startX = -extendedWidth / 2;
  const startY = -extendedHeight / 2;
  
  // Create vertical small grid lines
  for (let position = startX; position <= extendedWidth && smallGridCount < MAX_SMALL_GRID_LINES; position += smallGridStep) {
    // Create more visible lines with increased opacity and slightly darker color
    const smallGridLine = new Line([position, startY, position, extendedHeight], {
      stroke: "#A0C5E0", // Darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.85 // Increased opacity for better visibility
    });
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  // Create horizontal small grid lines
  for (let position = startY; position <= extendedHeight && smallGridCount < MAX_SMALL_GRID_LINES*2; position += smallGridStep) {
    const smallGridLine = new Line([startX, position, extendedWidth, position], {
      stroke: "#A0C5E0", // Darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.85 // Increased opacity for better visibility
    });
    
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
  
  // Extended grid coverage with better visibility
  const extensionFactor = GRID_EXTENSION_FACTOR;
  const extendedWidth = canvasWidth * extensionFactor;
  const extendedHeight = canvasHeight * extensionFactor;
  const startX = -extendedWidth / 2;
  const startY = -extendedHeight / 2;
  
  // Create vertical large grid lines
  for (let position = startX; position <= extendedWidth && largeGridCount < MAX_LARGE_GRID_LINES; position += largeGridStep) {
    const largeGridLine = new Line([position, startY, position, extendedHeight], {
      stroke: "#4090CC", // Much darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 1.2, // Thicker line
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.95 // Increased opacity for better visibility
    });
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  // Create horizontal large grid lines
  for (let position = startY; position <= extendedHeight && largeGridCount < MAX_LARGE_GRID_LINES; position += largeGridStep) {
    const largeGridLine = new Line([startX, position, extendedWidth, position], {
      stroke: "#4090CC", // Much darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 1.2, // Thicker line
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.95 // Increased opacity for better visibility
    });
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Created ${largeGridObjects.length} large grid lines`);
  }
  
  return largeGridObjects;
};
