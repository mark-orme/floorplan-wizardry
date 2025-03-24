
/**
 * Functions for creating different types of grid lines
 * @module gridCreators
 */
import { Canvas, Line } from "fabric";
import { 
  MAX_SMALL_GRID_LINES, 
  MAX_LARGE_GRID_LINES,
  shouldSkipSmallGrid
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
  
  // Skip creating small grid entirely if it would create too many lines
  if (shouldSkipSmallGrid(canvasWidth, canvasHeight)) {
    console.log("Skipping small grid creation for performance - too many lines would be created");
    return smallGridObjects;
  }
  
  const smallGridStep = SMALL_GRID;
  const smallGridSkip = calculateSmallGridSkip(canvasWidth, canvasHeight);
  let smallGridCount = 0;
  
  // Create vertical small grid lines
  for (let i = 0; i < canvasWidth && smallGridCount < MAX_SMALL_GRID_LINES; i += smallGridStep * smallGridSkip) {
    const smallGridLine = new Line([i, 0, i, canvasHeight], {
      stroke: "#E6F3F8",
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
  for (let i = 0; i < canvasHeight && smallGridCount < MAX_SMALL_GRID_LINES; i += smallGridStep * smallGridSkip) {
    const smallGridLine = new Line([0, i, canvasWidth, i], {
      stroke: "#E6F3F8",
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
  
  // Create vertical large grid lines
  for (let i = 0; i < canvasWidth && largeGridCount < MAX_LARGE_GRID_LINES; i += largeGridStep * largeGridSkip) {
    const largeGridLine = new Line([i, 0, i, canvasHeight], {
      stroke: "#C2E2F3",
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
  for (let i = 0; i < canvasHeight && largeGridCount < MAX_LARGE_GRID_LINES; i += largeGridStep * largeGridSkip) {
    const largeGridLine = new Line([0, i, canvasWidth, i], {
      stroke: "#C2E2F3",
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
