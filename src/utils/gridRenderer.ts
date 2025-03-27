
/**
 * Grid rendering module
 * Renders and manages grid elements on canvas
 * @module gridRenderer
 */
import { Canvas, Line, Text } from "fabric";
import { GRID_POSITIONING, GRID_OFFSET_FACTOR } from "@/utils/grid/gridPositioningConstants";
import { GridLineOptions, GridRenderResult } from "@/utils/grid/typeUtils";
import logger from "@/utils/logger";

// Constants for grid rendering
const GRID_CONSTANTS = {
  SMALL_SPACING: 50,
  LARGE_SPACING: 250,
  SMALL_LINE_COLOR: "#DDDDDD",
  LARGE_LINE_COLOR: "#AAAAAA",
  MARKER_COLOR: "#666666",
  SMALL_LINE_WIDTH: 0.5,
  LARGE_LINE_WIDTH: 1.0,
  MIN_VALID_DIMENSION: 10
};

/**
 * Render grid components on canvas
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {GridRenderResult} Grid components
 */
export const renderGridComponents = (
  canvas: Canvas,
  width: number,
  height: number
): GridRenderResult => {
  // Validate dimensions to prevent division by zero or negative values
  if (!isFinite(width) || !isFinite(height) || 
      width < GRID_CONSTANTS.MIN_VALID_DIMENSION || 
      height < GRID_CONSTANTS.MIN_VALID_DIMENSION) {
    logger.warn(`Invalid dimensions for grid: ${width}x${height}`);
    return { smallGridLines: [], largeGridLines: [], markers: [], gridObjects: [] };
  }

  const result: GridRenderResult = {
    smallGridLines: [],
    largeGridLines: [],
    markers: [],
    gridObjects: []
  };

  try {
    // Calculate extended boundaries for grid
    const startX = -width * GRID_OFFSET_FACTOR;
    const startY = -height * GRID_OFFSET_FACTOR;
    const endX = width * (1 + GRID_OFFSET_FACTOR);
    const endY = height * (1 + GRID_OFFSET_FACTOR);

    // Create small grid lines
    for (let x = startX; x <= endX; x += GRID_CONSTANTS.SMALL_SPACING) {
      const line = createGridLine(x, startY, x, endY, {
        stroke: GRID_CONSTANTS.SMALL_LINE_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_LINE_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid-small',
        objectCaching: false,
        hoverCursor: 'default',
        opacity: 0.5
      });
      
      result.smallGridLines.push(line);
      result.gridObjects.push(line);
    }

    for (let y = startY; y <= endY; y += GRID_CONSTANTS.SMALL_SPACING) {
      const line = createGridLine(startX, y, endX, y, {
        stroke: GRID_CONSTANTS.SMALL_LINE_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_LINE_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid-small',
        objectCaching: false,
        hoverCursor: 'default',
        opacity: 0.5
      });
      
      result.smallGridLines.push(line);
      result.gridObjects.push(line);
    }

    // Create large grid lines
    for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_SPACING) {
      const line = createGridLine(x, startY, x, endY, {
        stroke: GRID_CONSTANTS.LARGE_LINE_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_LINE_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid-large',
        objectCaching: false,
        hoverCursor: 'default',
        opacity: 0.7
      });
      
      result.largeGridLines.push(line);
      result.gridObjects.push(line);
    }

    for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_SPACING) {
      const line = createGridLine(startX, y, endX, y, {
        stroke: GRID_CONSTANTS.LARGE_LINE_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_LINE_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid-large',
        objectCaching: false,
        hoverCursor: 'default',
        opacity: 0.7
      });
      
      result.largeGridLines.push(line);
      result.gridObjects.push(line);
    }

    // Add markers with measurements
    // Add all components to canvas
    result.gridObjects.forEach(obj => {
      canvas.add(obj);
    });

    return result;
  } catch (error) {
    logger.error("Error rendering grid components:", error);
    return { smallGridLines: [], largeGridLines: [], markers: [], gridObjects: [] };
  }
};

/**
 * Create a grid line
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate 
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 * @param {GridLineOptions} options - Line options
 * @returns {Line} Fabric Line object
 */
function createGridLine(
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  options: GridLineOptions
): Line {
  return new Line([x1, y1, x2, y2], options);
}

/**
 * Arrange grid objects in the correct z-order
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {Line[]} smallGridLines - Small grid lines
 * @param {Line[]} largeGridLines - Large grid lines
 * @param {any[]} markers - Grid markers
 */
export const arrangeGridObjects = (
  canvas: Canvas,
  smallGridLines: Line[],
  largeGridLines: Line[],
  markers: any[]
): void => {
  // Send grid elements to back in correct order
  try {
    // Markers on top
    markers.forEach(marker => {
      canvas.bringToFront(marker);
    });

    // Large grid lines in the middle
    largeGridLines.forEach(line => {
      line.bringToFront();
    });

    // Small grid lines at the back
    smallGridLines.forEach(line => {
      line.bringToFront();
    });

    // Send all grid objects to back as a group
    canvas.renderAll();
  } catch (error) {
    logger.error("Error arranging grid objects:", error);
  }
};
