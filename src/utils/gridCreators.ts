
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
 * @param canvas - The Fabric canvas instance
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height 
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
  // Use a smaller skip factor to show more small grid lines
  const smallGridSkip = Math.max(1, Math.floor(calculateSmallGridSkip(canvasWidth, canvasHeight) / 2));
  let smallGridCount = 0;
  
  // Calculate grid boundaries with extension factor
  const gridWidth = canvasWidth * GRID_EXTENSION_FACTOR;
  const gridHeight = canvasHeight * GRID_EXTENSION_FACTOR;
  const gridStartX = -gridWidth / 4; // Starting from closer to center
  const gridStartY = -gridHeight / 4; // Starting from closer to center
  
  // Create vertical small grid lines
  for (let i = 0; i <= canvasWidth && smallGridCount < MAX_SMALL_GRID_LINES; i += smallGridStep) {
    const smallGridLine = new Line([i, 0, i, canvasHeight], {
      stroke: "#E1EDF2",
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  // Create horizontal small grid lines
  for (let i = 0; i <= canvasHeight && smallGridCount < MAX_SMALL_GRID_LINES * 2; i += smallGridStep) {
    const smallGridLine = new Line([0, i, canvasWidth, i], {
      stroke: "#E1EDF2",
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    smallGridObjects.push(smallGridLine);
    smallGridCount++;
  }
  
  console.log(`Created ${smallGridObjects.length} small grid lines`);
  return smallGridObjects;
};

/**
 * Creates large grid lines
 * @param canvas - The Fabric canvas instance
 * @param canvasWidth - Canvas width
 * @param canvasHeight - Canvas height
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
  
  // Create vertical large grid lines
  for (let i = 0; i <= canvasWidth && largeGridCount < MAX_LARGE_GRID_LINES; i += largeGridStep) {
    const largeGridLine = new Line([i, 0, i, canvasHeight], {
      stroke: "#B5DBE8",
      selectable: false,
      evented: false,
      strokeWidth: 1,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  // Create horizontal large grid lines
  for (let i = 0; i <= canvasHeight && largeGridCount < MAX_LARGE_GRID_LINES; i += largeGridStep) {
    const largeGridLine = new Line([0, i, canvasWidth, i], {
      stroke: "#B5DBE8",
      selectable: false,
      evented: false,
      strokeWidth: 1,
      objectCaching: true,
      hoverCursor: 'default'
    });
    
    largeGridObjects.push(largeGridLine);
    largeGridCount++;
  }
  
  console.log(`Created ${largeGridObjects.length} large grid lines`);
  return largeGridObjects;
};
