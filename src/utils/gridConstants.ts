
/**
 * Grid constants module
 * Defines constants used for grid drawing and configuration
 * @module gridConstants
 */

// Import from central constants module
import {
  PIXELS_PER_METER,
  GRID_SPACING,
  MAX_SMALL_GRID_LINES,
  MAX_LARGE_GRID_LINES,
  GRID_EXTENSION_FACTOR
} from '@/constants/numerics';

/**
 * Grid dimensions type
 * Defines the structure for width and height measurements
 * @interface GridDimensions
 */
export interface GridDimensions {
  /** Width of the grid in pixels */
  width: number;
  /** Height of the grid in pixels */
  height: number;
}

/**
 * Grid scale constants
 */
export const GRID_SCALE = {
  /**
   * Conversion factor from pixels to meters
   * Critical for accurate scale representation
   * @constant {number}
   */
  FACTOR: PIXELS_PER_METER, // 100px = 1 meter
  
  /**
   * Small grid spacing in meters
   * Controls the density of minor grid lines
   * @constant {number}
   */
  SMALL_SPACING: 0.1, // 0.1 meter
  
  /**
   * Large grid spacing in meters
   * Controls the density of major grid lines
   * @constant {number}
   */
  LARGE_SPACING: 1.0, // 1.0 meter
  
  /**
   * Interval for text markers in meters
   * Determines how often measurement labels appear
   * @constant {number}
   */
  MARKER_INTERVAL: 1.0 // Text markers every 1 meter
};

// Re-export constants from numerics
export {
  PIXELS_PER_METER,
  GRID_SPACING,
  MAX_SMALL_GRID_LINES,
  MAX_LARGE_GRID_LINES,
  GRID_EXTENSION_FACTOR
};

/**
 * Grid line width constants
 */
export const GRID_LINE_WIDTH = {
  /**
   * Line width for small grid lines in pixels
   * Increased from 0.5 for better visibility
   * @constant {number}
   */
  SMALL: 0.7,
  
  /**
   * Line width for large grid lines in pixels
   * Thicker than small grid lines for visual hierarchy
   * @constant {number}
   */
  LARGE: 1.0
};

/**
 * Performance threshold constants
 */
export const GRID_PERFORMANCE_THRESHOLDS = {
  /**
   * Threshold for skipping small grid (square pixels)
   * Above this canvas area, small grid lines are hidden
   * @constant {number}
   */
  SKIP_SMALL_GRID: 8000000, // 8 million square pixels
  
  /**
   * Threshold for reducing grid density level 1 (square pixels)
   * Above this canvas area, grid density is reduced
   * @constant {number}
   */
  REDUCE_DENSITY_LEVEL_1: 4000000 // 4 million square pixels
};

/**
 * Grid opacity constants
 */
export const GRID_OPACITY = {
  /**
   * Opacity for small grid lines
   * Increased for better visibility (was 0.8)
   * @constant {number}
   */
  SMALL_GRID: 0.9,
  
  /**
   * Opacity for large grid lines
   * Higher opacity for better visibility of major lines
   * @constant {number}
   */
  LARGE_GRID: 0.9
};

/**
 * Grid color constants
 */
export const GRID_COLORS = {
  /**
   * Color for small grid lines
   * Darkened for better visibility (was #85B4BD)
   * @constant {string}
   */
  SMALL_GRID: "#6999A3",
  
  /**
   * Color for large grid lines
   * Darker blue-green for large grid
   * @constant {string}
   */
  LARGE_GRID: "#5FA1A9",
  
  /**
   * Color for measurement markers
   * Dark gray for better readability
   * @constant {string}
   */
  MARKERS: "#555555"
};

/**
 * Grid text styling constants
 */
export const GRID_TEXT = {
  /**
   * Font size for grid text in pixels
   * @constant {number}
   */
  FONT_SIZE: 12,
  
  /**
   * Font family for grid text
   * @constant {string}
   */
  FONT_FAMILY: 'Arial'
};

/**
 * Style options for small grid lines
 * Fabric.js options for consistent styling
 * @constant {Object}
 */
export const SMALL_GRID_LINE_OPTIONS = {
  stroke: GRID_COLORS.SMALL_GRID,
  selectable: false,
  evented: false,
  strokeWidth: GRID_LINE_WIDTH.SMALL,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: GRID_OPACITY.SMALL_GRID
};

/**
 * Style options for large grid lines
 * Fabric.js options for consistent styling
 * @constant {Object}
 */
export const LARGE_GRID_LINE_OPTIONS = {
  stroke: GRID_COLORS.LARGE_GRID,
  selectable: false,
  evented: false,
  strokeWidth: GRID_LINE_WIDTH.LARGE,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: GRID_OPACITY.LARGE_GRID
};

/**
 * Style options for grid marker text
 * Fabric.js options for consistent styling
 * @constant {Object}
 */
export const MARKER_TEXT_OPTIONS = {
  fontSize: GRID_TEXT.FONT_SIZE,
  fontFamily: GRID_TEXT.FONT_FAMILY,
  fill: GRID_COLORS.MARKERS,
  selectable: false,
  evented: false,
  objectCaching: true
};

/**
 * Grid marker visibility constants
 */
export const GRID_MARKER = {
  /**
   * Flag to disable grid markers
   * When true, grid measurements will not be displayed
   * @constant {boolean}
   */
  DISABLE: true
};

/**
 * Determines if small grid should be skipped based on canvas size
 * Used for performance optimization on large canvases
 * 
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {boolean} True if small grid should be skipped
 */
export const shouldSkipSmallGrid = (width: number, height: number): boolean => {
  return width * height > GRID_PERFORMANCE_THRESHOLDS.SKIP_SMALL_GRID;
};

/**
 * Calculate grid density based on canvas dimensions
 * Adjusts grid visibility and interval for performance
 * 
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Object} Grid density configuration
 */
export const calculateGridDensity = (width: number, height: number) => {
  const area = width * height;
  
  // For very large canvases, reduce grid density
  if (area > GRID_PERFORMANCE_THRESHOLDS.SKIP_SMALL_GRID) {
    return { smallGridVisible: false, smallGridInterval: 5 };
  } else if (area > GRID_PERFORMANCE_THRESHOLDS.REDUCE_DENSITY_LEVEL_1) {
    return { smallGridVisible: true, smallGridInterval: 2 };
  } else {
    return { smallGridVisible: true, smallGridInterval: 1 };
  }
};

// For backward compatibility
export const SMALL_GRID_LINE_WIDTH = GRID_LINE_WIDTH.SMALL;
export const LARGE_GRID_LINE_WIDTH = GRID_LINE_WIDTH.LARGE;
export const DISABLE_GRID_MARKERS = GRID_MARKER.DISABLE;
