
/**
 * Grid rendering utilities
 * Handles the rendering of grid components on the canvas
 * @module gridRenderer
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";
import {
  GRID_SCALE_FACTOR,
  LARGE_GRID_SPACING,
  SMALL_GRID_SPACING,
  MARKER_INTERVAL,
  SMALL_GRID_LINE_OPTIONS,
  LARGE_GRID_LINE_OPTIONS,
  MARKER_TEXT_OPTIONS,
  calculateGridDensity
} from "./gridConstants";
import logger from "./logger";

/**
 * Result of grid rendering operation
 * @interface GridRenderResult
 */
export interface GridRenderResult {
  /** All grid objects combined */
  gridObjects: FabricObject[];
  /** Small grid lines only */
  smallGridLines: FabricObject[];
  /** Large grid lines only */
  largeGridLines: FabricObject[];
  /** Text markers only */
  markers: FabricObject[];
}

/**
 * Render all grid components at once
 * Creates small/large grid lines and markers in a single batch
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {GridRenderResult} Created grid objects
 */
export const renderGridComponents = (
  canvas: Canvas,
  width: number,
  height: number
): GridRenderResult => {
  // Initialize result arrays
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  const markers: FabricObject[] = [];
  
  // Calculate grid density based on canvas size
  const { smallGridVisible, smallGridInterval } = calculateGridDensity(width, height);
  
  // Calculate the number of grid cells based on dimensions
  const widthInMeters = Math.ceil(width / GRID_SCALE_FACTOR);
  const heightInMeters = Math.ceil(height / GRID_SCALE_FACTOR);
  
  logger.debug(`Creating grid for ${widthInMeters}m x ${heightInMeters}m area`);
  
  // Create vertical grid lines
  for (let i = 0; i <= widthInMeters; i += SMALL_GRID_SPACING) {
    const isLargeGridLine = i % LARGE_GRID_SPACING === 0;
    const x = i * GRID_SCALE_FACTOR;
    
    // Only create small grid lines if they're visible and match the interval
    if (isLargeGridLine || (smallGridVisible && i % (SMALL_GRID_SPACING * smallGridInterval) === 0)) {
      const line = new Line(
        [x, 0, x, height],
        isLargeGridLine ? LARGE_GRID_LINE_OPTIONS : SMALL_GRID_LINE_OPTIONS
      );
      
      if (isLargeGridLine) {
        largeGridLines.push(line);
      } else {
        smallGridLines.push(line);
      }
      
      // Add markers at intervals
      if (isLargeGridLine && i % MARKER_INTERVAL === 0 && i > 0) {
        const marker = new Text(i.toString(), {
          ...MARKER_TEXT_OPTIONS,
          left: x - 5,
          top: 5
        });
        markers.push(marker);
      }
    }
  }
  
  // Create horizontal grid lines
  for (let i = 0; i <= heightInMeters; i += SMALL_GRID_SPACING) {
    const isLargeGridLine = i % LARGE_GRID_SPACING === 0;
    const y = i * GRID_SCALE_FACTOR;
    
    // Only create small grid lines if they're visible and match the interval
    if (isLargeGridLine || (smallGridVisible && i % (SMALL_GRID_SPACING * smallGridInterval) === 0)) {
      const line = new Line(
        [0, y, width, y],
        isLargeGridLine ? LARGE_GRID_LINE_OPTIONS : SMALL_GRID_LINE_OPTIONS
      );
      
      if (isLargeGridLine) {
        largeGridLines.push(line);
      } else {
        smallGridLines.push(line);
      }
      
      // Add markers at intervals
      if (isLargeGridLine && i % MARKER_INTERVAL === 0 && i > 0) {
        const marker = new Text(i.toString(), {
          ...MARKER_TEXT_OPTIONS,
          left: 5,
          top: y - 10
        });
        markers.push(marker);
      }
    }
  }
  
  // Combine all grid objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers
  };
};

/**
 * Arrange grid objects in correct z-order
 * Places small grid lines at the back, large grid lines in the middle, and markers at the front
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} smallGridLines - Small grid lines
 * @param {FabricObject[]} largeGridLines - Large grid lines
 * @param {FabricObject[]} markers - Grid markers
 */
export const arrangeGridObjects = (
  canvas: Canvas,
  smallGridLines: FabricObject[],
  largeGridLines: FabricObject[],
  markers: FabricObject[]
): void => {
  // Add all objects to canvas if not already added
  const allObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  allObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
    }
  });
  
  // Arrange z-order: small lines at back, large lines in middle, markers at front
  smallGridLines.forEach(obj => canvas.sendObjectToBack(obj));
  
  // Use bringObjectToFront instead of bringForward for Fabric.js v6 compatibility
  largeGridLines.forEach(obj => {
    // First send to back, then bring forward so they're between small grid and markers
    canvas.sendObjectToBack(obj);
    canvas.bringObjectToFront(obj);
    // Then send behind markers which will be brought to front next
    smallGridLines.forEach(() => canvas.sendObjectBackwards(obj));
  });
  
  markers.forEach(obj => canvas.bringObjectToFront(obj));
  
  // Request render
  canvas.requestRenderAll();
};
