
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

// Grid dimensions type
export interface GridDimensions {
  width: number;
  height: number;
}

// Re-export constants for backward compatibility
export const GRID_SCALE_FACTOR = PIXELS_PER_METER; // 100px = 1 meter
export const SMALL_GRID_SPACING = GRID_SPACING; // 0.1 meter
export const LARGE_GRID_SPACING = 1.0; // 1.0 meter
export const MARKER_INTERVAL = 1.0; // Text markers every 1 meter

// Re-export constants from numerics
export {
  PIXELS_PER_METER,
  GRID_SPACING,
  MAX_SMALL_GRID_LINES,
  MAX_LARGE_GRID_LINES,
  GRID_EXTENSION_FACTOR
};

// Updated line widths for improved grid appearance
export const SMALL_GRID_LINE_WIDTH = 0.5;
export const LARGE_GRID_LINE_WIDTH = 1.0;

/**
 * Canvas size thresholds for grid performance optimizations
 * @constant {Object}
 */
export const GRID_PERFORMANCE_THRESHOLDS = {
  /**
   * Threshold for skipping small grid (square pixels)
   * @constant {number}
   */
  SKIP_SMALL_GRID: 8000000,
  
  /**
   * Threshold for reducing grid density level 1 (square pixels)
   * @constant {number}
   */
  REDUCE_DENSITY_LEVEL_1: 4000000
};

/**
 * Default opacity values for grid elements
 * @constant {Object}
 */
export const GRID_OPACITY = {
  SMALL_GRID: 0.8, // Increased opacity for better visibility
  LARGE_GRID: 0.9  // Higher opacity for large grid lines
};

/**
 * Default grid colors - updated to match graph paper look with darker small grid
 * @constant {Object}
 */
export const GRID_COLORS = {
  SMALL_GRID: "#85B4BD", // Darker blue-green for better visibility (was #A6CDD3)
  LARGE_GRID: "#5FA1A9", // Darker blue-green for large grid (was #86C5CD)
  MARKERS: "#555555"     // Dark gray for markers
};

/**
 * Grid text styling
 * @constant {Object}
 */
export const GRID_TEXT = {
  FONT_SIZE: 12,
  FONT_FAMILY: 'Arial'
};

// Style options for grid lines
export const SMALL_GRID_LINE_OPTIONS = {
  stroke: GRID_COLORS.SMALL_GRID,
  selectable: false,
  evented: false,
  strokeWidth: SMALL_GRID_LINE_WIDTH,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: GRID_OPACITY.SMALL_GRID
};

export const LARGE_GRID_LINE_OPTIONS = {
  stroke: GRID_COLORS.LARGE_GRID,
  selectable: false,
  evented: false,
  strokeWidth: LARGE_GRID_LINE_WIDTH,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: GRID_OPACITY.LARGE_GRID
};

export const MARKER_TEXT_OPTIONS = {
  fontSize: GRID_TEXT.FONT_SIZE,
  fontFamily: GRID_TEXT.FONT_FAMILY,
  fill: GRID_COLORS.MARKERS,
  selectable: false,
  evented: false,
  objectCaching: true
};

// Set to true to disable markers - this ensures grid numbers don't appear
export const DISABLE_GRID_MARKERS = true;

/**
 * Determines if small grid should be skipped based on canvas size
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
