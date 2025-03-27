/**
 * Utility functions for grid creation
 * @module grid/gridCreation
 */
import { Line } from 'fabric';

// Instead of using moveTo which doesn't exist on Line, we'll create a utility
const moveLineToPosition = (line: Line, x1: number, y1: number, x2: number, y2: number) => {
  line.set({
    x1,
    y1,
    x2,
    y2
  });
  return line;
};

// Instead of using sendToBack which may not exist on Line, we'll create a utility
const sendObjectToBack = (canvas: any, object: any) => {
  if (canvas && object) {
    if (typeof object.sendToBack === 'function') {
      object.sendToBack();
    } else {
      // Alternative method to send to back
      canvas.sendToBack(object);
    }
  }
};

/**
 * Constants for grid styling and behavior
 */
export const GRID_CONSTANTS = {
  /** Small grid line color */
  SMALL_GRID_COLOR: "#e9e9e9",
  
  /** Large grid line color */
  LARGE_GRID_COLOR: "#cccccc",
  
  /** Small grid line thickness */
  SMALL_GRID_WIDTH: 0.5,
  
  /** Large grid line thickness */
  LARGE_GRID_WIDTH: 1,
  
  /** Small grid spacing in pixels */
  SMALL_GRID_SPACING: 10,
  
  /** Large grid spacing in pixels (every X small grid lines) */
  LARGE_GRID_INTERVAL: 5,
  
  /** Grid line opacity */
  GRID_OPACITY: 0.8
};

/**
 * Create options for grid lines
 * @param {string} color - Line color
 * @param {number} width - Line width
 * @returns {GridLineOptions} Grid line options
 */
export const createGridLineOptions = (color: string, width: number): GridLineOptions => {
  return {
    stroke: color,
    strokeWidth: width,
    selectable: false,
    evented: false,
    objectType: 'grid-line',
    objectCaching: false,
    hoverCursor: 'default',
    opacity: GRID_CONSTANTS.GRID_OPACITY
  };
};

/**
 * Creates a small-scale grid
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Line[]} Array of grid line objects
 */
export const createSmallScaleGrid = (canvas: FabricCanvas, width: number, height: number): Line[] => {
  const gridLines: Line[] = [];
  const options = createGridLineOptions(GRID_CONSTANTS.SMALL_GRID_COLOR, GRID_CONSTANTS.SMALL_GRID_WIDTH);

  // Create vertical lines
  for (let x = 0; x <= width; x += GRID_CONSTANTS.SMALL_GRID_SPACING) {
    const line = new Line([x, 0, x, height], options);
    gridLines.push(line);
    canvas.add(line);
    sendObjectToBack(canvas, line);
  }

  // Create horizontal lines
  for (let y = 0; y <= height; y += GRID_CONSTANTS.SMALL_GRID_SPACING) {
    const line = new Line([0, y, width, y], options);
    gridLines.push(line);
    canvas.add(line);
    sendObjectToBack(canvas, line);
  }

  return gridLines;
};

/**
 * Creates a large-scale grid
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Line[]} Array of grid line objects
 */
export const createLargeScaleGrid = (canvas: FabricCanvas, width: number, height: number): Line[] => {
  const gridLines: Line[] = [];
  const options = createGridLineOptions(GRID_CONSTANTS.LARGE_GRID_COLOR, GRID_CONSTANTS.LARGE_GRID_WIDTH);
  const spacing = GRID_CONSTANTS.SMALL_GRID_SPACING * GRID_CONSTANTS.LARGE_GRID_INTERVAL;

  // Create vertical lines
  for (let x = 0; x <= width; x += spacing) {
    const line = new Line([x, 0, x, height], options);
    gridLines.push(line);
    canvas.add(line);
    sendObjectToBack(canvas, line);
  }

  // Create horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    const line = new Line([0, y, width, y], options);
    gridLines.push(line);
    canvas.add(line);
    sendObjectToBack(canvas, line);
  }

  return gridLines;
};

/**
 * Export GridRenderResult type from grid/typeUtils for external use
 */
export { GridRenderResult } from "./typeUtils";

export type { GridConfig, GridDimensions } from './gridTypes';
