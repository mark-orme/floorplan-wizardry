
/**
 * Grid constants module
 * Defines constants used for grid drawing and configuration
 * @module gridConstants
 */

// Grid scale factors
export const GRID_SCALE_FACTOR = 100; // 100px = 1 meter
export const SMALL_GRID_SPACING = 0.1; // 0.1 meter
export const LARGE_GRID_SPACING = 1.0; // 1.0 meter
export const MARKER_INTERVAL = 1.0; // Text markers every 1 meter

// Grid size limits to prevent performance issues
export const MAX_SMALL_GRID_LINES = 1000;
export const MAX_LARGE_GRID_LINES = 200;

// Grid extension factor (how much beyond canvas to draw)
export const GRID_EXTENSION_FACTOR = 1.5;

// Style options for grid lines
export const SMALL_GRID_LINE_OPTIONS = {
  stroke: "#A0C5E0",
  selectable: false,
  evented: false,
  strokeWidth: 0.5,
  objectCaching: true,
  hoverCursor: 'default',
  opacity: 0.85
};

export const LARGE_GRID_LINE_OPTIONS = {
  stroke: "#4090CC",
  selectable: false,
  evented: false,
  strokeWidth: 1.2,
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

/**
 * Determines if small grid should be skipped based on canvas size
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {boolean} True if small grid should be skipped
 */
export const shouldSkipSmallGrid = (width: number, height: number): boolean => {
  return width * height > 5000000;
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
  if (area > 5000000) {
    return { smallGridVisible: false, smallGridInterval: 5 };
  } else if (area > 2000000) {
    return { smallGridVisible: true, smallGridInterval: 2 };
  } else {
    return { smallGridVisible: true, smallGridInterval: 1 };
  }
};
