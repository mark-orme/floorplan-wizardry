
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
  const smallGridObjects: Line[] = [];
  
  // Only skip small grid if dimensions are EXTREMELY large
  if (canvasWidth * canvasHeight > 3000000) {
    console.log("Skipping small grid creation for performance - too many lines would be created");
    return smallGridObjects;
  }
  
  const smallGridStep = SMALL_GRID;
  // Use a smaller skip factor to show more small grid lines
  const smallGridSkip = Math.max(1, Math.floor(calculateSmallGridSkip(canvasWidth, canvasHeight) / 4));
  let smallGridCount = 0;
  
  // Calculate grid boundaries with extension factor
  const gridWidth = canvasWidth * GRID_EXTENSION_FACTOR;
  const gridHeight = canvasHeight * GRID_EXTENSION_FACTOR;
  const gridStartX = -gridWidth / 2;
  const gridStartY = -gridHeight / 2;
  
  // Create vertical small grid lines
  for (let i = gridStartX; i < gridWidth / 2 && smallGridCount < MAX_SMALL_GRID_LINES * 2; i += smallGridStep * smallGridSkip) {
    const smallGridLine = new Line([i, gridStartY, i, gridHeight / 2], {
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
  for (let i = gridStartY; i < gridHeight / 2 && smallGridCount < MAX_SMALL_GRID_LINES * 4; i += smallGridStep * smallGridSkip) {
    const smallGridLine = new Line([gridStartX, i, gridWidth / 2, i], {
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
  const largeGridObjects: Line[] = [];
  const largeGridStep = LARGE_GRID;
  const largeGridSkip = calculateLargeGridSkip(canvasWidth, canvasHeight);
  
  let largeGridCount = 0;
  
  // Calculate grid boundaries with extension factor
  const gridWidth = canvasWidth * GRID_EXTENSION_FACTOR;
  const gridHeight = canvasHeight * GRID_EXTENSION_FACTOR;
  const gridStartX = -gridWidth / 2;
  const gridStartY = -gridHeight / 2;
  
  // Create vertical large grid lines with extended length
  for (let i = gridStartX; i < gridWidth / 2 && largeGridCount < MAX_LARGE_GRID_LINES * 2; i += largeGridStep * largeGridSkip) {
    const largeGridLine = new Line([i, gridStartY, i, gridHeight / 2], {
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
  
  // Create horizontal large grid lines with extended width
  for (let i = gridStartY; i < gridHeight / 2 && largeGridCount < MAX_LARGE_GRID_LINES * 2; i += largeGridStep * largeGridSkip) {
    const largeGridLine = new Line([gridStartX, i, gridWidth / 2, i], {
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
  
  return largeGridObjects;
};
