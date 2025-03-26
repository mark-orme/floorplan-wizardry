
/**
 * Grid constants module
 * Re-exports from central numerics module
 * Defines constants used for grid drawing and configuration
 * @module gridConstants
 */

// Import from central constants module
import {
  PIXELS_PER_METER,
  GRID_SPACING,
  SMALL_GRID_LINE_WIDTH,
  LARGE_GRID_LINE_WIDTH,
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
  SMALL_GRID_LINE_WIDTH,
  LARGE_GRID_LINE_WIDTH,
  MAX_SMALL_GRID_LINES,
  MAX_LARGE_GRID_LINES,
  GRID_EXTENSION_FACTOR
};

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

// Style options for grid lines
export const SMALL_GRID_LINE_OPTIONS = {
  stroke: "#A0C5E0",
  selectable: false,
  evented: false,
  strokeWidth: SMALL_GRID_LINE_WIDTH,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: 0.85
};

export const LARGE_GRID_LINE_OPTIONS = {
  stroke: "#4090CC",
  selectable: false,
  evented: false,
  strokeWidth: LARGE_GRID_LINE_WIDTH,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: 0.95
};

export const MARKER_TEXT_OPTIONS = {
  fontSize: 12,
  fontFamily: 'Arial',
  fill: '#555555',
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
