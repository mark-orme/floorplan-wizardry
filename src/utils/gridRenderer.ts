
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
  calculateGridDensity,
  DISABLE_GRID_MARKERS
} from "./gridConstants";
import logger from "./logger";
import { createSmallGrid, createLargeGrid } from "./gridCreators";

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
  
  try {
    // Use the dedicated grid creators
    const smallGrid = createSmallGrid(canvas, width, height);
    const largeGrid = createLargeGrid(canvas, width, height);
    
    smallGridLines.push(...smallGrid);
    largeGridLines.push(...largeGrid);
    
    // Add text markers at major grid intersections only if not disabled
    if (!DISABLE_GRID_MARKERS) {
      const widthInMeters = Math.ceil(width / GRID_SCALE_FACTOR);
      const heightInMeters = Math.ceil(height / GRID_SCALE_FACTOR);
      
      // Create horizontal markers (along x-axis)
      for (let i = LARGE_GRID_SPACING; i <= widthInMeters; i += MARKER_INTERVAL) {
        const x = i * GRID_SCALE_FACTOR;
        const marker = new Text(i.toString(), {
          ...MARKER_TEXT_OPTIONS,
          left: x - 5,
          top: 5
        });
        markers.push(marker);
      }
      
      // Create vertical markers (along y-axis)
      for (let i = LARGE_GRID_SPACING; i <= heightInMeters; i += MARKER_INTERVAL) {
        const y = i * GRID_SCALE_FACTOR;
        const marker = new Text(i.toString(), {
          ...MARKER_TEXT_OPTIONS,
          left: 5,
          top: y - 10
        });
        markers.push(marker);
      }
    }
    
    logger.debug(`Created ${smallGridLines.length} small grid lines, ${largeGridLines.length} large grid lines, and ${markers.length} markers`);
  } catch (error) {
    logger.error("Error creating grid components:", error);
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
