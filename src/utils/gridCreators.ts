
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
  console.log("Creating small grid lines");
  const smallGridObjects: Line[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    console.error("Invalid canvas dimensions for small grid:", canvasWidth, canvasHeight);
    return smallGridObjects;
  }
  
  // Only skip small grid if dimensions are EXTREMELY large
  if (canvasWidth * canvasHeight > 3000000) {
    console.log("Skipping small grid creation for performance - too many lines would be created");
    return smallGridObjects;
  }
  
  const smallGridStep = SMALL_GRID;
  let smallGridCount = 0;
  
  // Ensure we have enough grid lines by creating more than needed
  // Start with negative values to ensure grid covers the entire visible area
  for (let i = -canvasWidth/2; i <= canvasWidth*1.5 && smallGridCount < MAX_SMALL_GRID_LINES; i += smallGridStep) {
    // Create more visible lines with increased opacity and slightly darker color
    const smallGridLine = new Line([i, -canvasHeight/2, i, canvasHeight*1.5], {
      stroke: "#C0D5E0", // Darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.8 // Increased opacity
    });
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  // Create horizontal small grid lines
  for (let i = -canvasHeight/2; i <= canvasHeight*1.5 && smallGridCount < MAX_SMALL_GRID_LINES*2; i += smallGridStep) {
    const smallGridLine = new Line([-canvasWidth/2, i, canvasWidth*1.5, i], {
      stroke: "#C0D5E0", // Darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.8 // Increased opacity
    });
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  console.log(`Created ${smallGridObjects.length} small grid lines`);
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
  console.log("Creating large grid lines");
  const largeGridObjects: Line[] = [];
  
  // Safety check for dimensions
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    console.error("Invalid canvas dimensions for large grid:", canvasWidth, canvasHeight);
    return largeGridObjects;
  }
  
  const largeGridStep = LARGE_GRID;
  let largeGridCount = 0;
  
  // Create more large grid lines with extended coverage
  // Start with negative values to ensure grid covers the entire visible area
  for (let i = -canvasWidth/2; i <= canvasWidth*1.5 && largeGridCount < MAX_LARGE_GRID_LINES; i += largeGridStep) {
    const largeGridLine = new Line([i, -canvasHeight/2, i, canvasHeight*1.5], {
      stroke: "#81B7CC", // Darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 1,
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.9 // Increased opacity
    });
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  // Create horizontal large grid lines
  for (let i = -canvasHeight/2; i <= canvasHeight*1.5 && largeGridCount < MAX_LARGE_GRID_LINES; i += largeGridStep) {
    const largeGridLine = new Line([-canvasWidth/2, i, canvasWidth*1.5, i], {
      stroke: "#81B7CC", // Darker blue for better visibility
      selectable: false,
      evented: false,
      strokeWidth: 1,
      objectCaching: true,
      hoverCursor: 'default',
      opacity: 0.9 // Increased opacity
    });
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  console.log(`Created ${largeGridObjects.length} large grid lines`);
  return largeGridObjects;
};

