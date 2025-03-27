
/**
 * Grid creation utilities module
 * Provides functions for creating grid elements
 * @module grid/gridCreation
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";
import { GridLineOptions } from "./typeUtils";

/**
 * Grid creation constants
 * Controls grid appearance and performance limits
 */
const GRID_CREATION = {
  /**
   * Default grid object type identifier
   * Used to identify grid objects in the canvas
   * @constant {string}
   */
  OBJECT_TYPE: 'grid',
  
  /**
   * Minimum valid canvas dimensions in pixels
   * Prevents creation on invalid canvases
   * @constant {number}
   */
  MIN_VALID_DIMENSION: 10,
  
  /**
   * Default grid spacing when none is provided
   * Fallback value for grid creation
   * @constant {number}
   */
  DEFAULT_SPACING: 50,
  
  /**
   * Maximum number of grid lines per dimension
   * Prevents performance issues from excessive grid density
   * @constant {number}
   */
  MAX_LINES_PER_DIMENSION: 500,
  
  /**
   * Small grid spacing in pixels
   * Equivalent to 0.1m at standard scale
   * @constant {number}
   */
  SMALL_GRID_SPACING: 50,
  
  /**
   * Large grid spacing in pixels
   * Equivalent to 1m at standard scale
   * @constant {number}
   */
  LARGE_GRID_SPACING: 250,
  
  /**
   * Small grid line color
   * @constant {string}
   */
  SMALL_GRID_COLOR: '#DDDDDD',
  
  /**
   * Large grid line color
   * @constant {string}
   */
  LARGE_GRID_COLOR: '#AAAAAA',
  
  /**
   * Small grid line width
   * @constant {number}
   */
  SMALL_LINE_WIDTH: 0.5,
  
  /**
   * Large grid line width
   * @constant {number}
   */
  LARGE_LINE_WIDTH: 1.0
};

/**
 * Small grid line options
 * Visual properties for small grid lines
 */
export const SMALL_GRID_LINE_OPTIONS: GridLineOptions = {
  stroke: GRID_CREATION.SMALL_GRID_COLOR,
  strokeWidth: GRID_CREATION.SMALL_LINE_WIDTH,
  selectable: false,
  evented: false,
  objectType: GRID_CREATION.OBJECT_TYPE,
  objectCaching: false,
  hoverCursor: 'default',
  opacity: 0.5
};

/**
 * Large grid line options
 * Visual properties for large grid lines
 */
export const LARGE_GRID_LINE_OPTIONS: GridLineOptions = {
  stroke: GRID_CREATION.LARGE_GRID_COLOR,
  strokeWidth: GRID_CREATION.LARGE_LINE_WIDTH,
  selectable: false,
  evented: false,
  objectType: GRID_CREATION.OBJECT_TYPE,
  objectCaching: false,
  hoverCursor: 'default',
  opacity: 0.7
};

/**
 * Create a grid line
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 * @param {GridLineOptions} options - Line options
 * @returns {Line} Created line
 */
export const createGridLine = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  options: GridLineOptions
): Line => {
  try {
    return new Line([x1, y1, x2, y2], options);
  } catch (error) {
    logger.error("Error creating grid line:", error);
    throw error;
  }
};

/**
 * Create small grid line
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 * @returns {Line} Small grid line
 */
export const createSmallGridLine = (x1: number, y1: number, x2: number, y2: number): Line => {
  return createGridLine(x1, y1, x2, y2, SMALL_GRID_LINE_OPTIONS);
};

/**
 * Create large grid line
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 * @returns {Line} Large grid line
 */
export const createLargeGridLine = (x1: number, y1: number, x2: number, y2: number): Line => {
  return createGridLine(x1, y1, x2, y2, LARGE_GRID_LINE_OPTIONS);
};
