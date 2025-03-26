
/**
 * Grid constants for canvas grid rendering
 * Contains configuration values for grid dimensions and styling
 * @module gridConstants
 */
import logger from "./logger";

/** Base cell size in pixels */
export const GRID_CELL_SIZE = 20;

/** Scale factor for real-world dimensions (1 meter = 100 pixels) */
export const GRID_SCALE_FACTOR = 100;

/** Small grid line color */
export const SMALL_GRID_COLOR = '#e5e5e5';

/** Large grid line color */
export const LARGE_GRID_COLOR = '#cccccc';

/** Text marker color */
export const MARKER_TEXT_COLOR = '#888888';

/** Line marker color */
export const MARKER_LINE_COLOR = '#888888';

/** Distance between large grid lines in meters */
export const LARGE_GRID_SPACING = 1; // 1 meter

/** Distance between small grid lines in meters */
export const SMALL_GRID_SPACING = 0.1; // 0.1 meters

/** Maximum grid rendering dimensions (pixels) */
export const MAX_GRID_DIMENSIONS = {
  width: 2000,
  height: 2000
};

/** How often to place numerical markers (in meters) */
export const MARKER_INTERVAL = 5; // Every 5 meters

/** Whether to use optimized grid rendering for large canvases */
export const USE_OPTIMIZED_GRID = true;

/** Threshold for using optimized grid rendering (width * height) */
export const OPTIMIZATION_THRESHOLD = 1000000; // 1M pixels (e.g., 1000x1000)

/** Default line options for small grid lines */
export const SMALL_GRID_LINE_OPTIONS = {
  stroke: SMALL_GRID_COLOR,
  strokeWidth: 0.5,
  selectable: false,
  evented: false,
  objectType: 'grid'
};

/** Default line options for large grid lines */
export const LARGE_GRID_LINE_OPTIONS = {
  stroke: LARGE_GRID_COLOR,
  strokeWidth: 1,
  selectable: false,
  evented: false,
  objectType: 'grid'
};

/** Default text options for grid markers */
export const MARKER_TEXT_OPTIONS = {
  fill: MARKER_TEXT_COLOR,
  fontFamily: 'Arial',
  fontSize: 12,
  selectable: false,
  evented: false,
  objectType: 'grid'
};

/**
 * Calculate optimized grid density based on canvas size
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {{ smallGridVisible: boolean, smallGridInterval: number }}
 */
export const calculateGridDensity = (width: number, height: number) => {
  const pixelArea = width * height;
  
  // Default values
  const defaultDensity = {
    smallGridVisible: true,
    smallGridInterval: 1 // Show every small grid line
  };
  
  if (!USE_OPTIMIZED_GRID || pixelArea < OPTIMIZATION_THRESHOLD) {
    return defaultDensity;
  }
  
  logger.debug(`Large canvas detected (${width}x${height}), optimizing grid density`);
  
  // For very large canvases, show fewer small grid lines
  if (pixelArea > OPTIMIZATION_THRESHOLD * 4) {
    return {
      smallGridVisible: false, // Hide small grid completely
      smallGridInterval: 0
    };
  } else if (pixelArea > OPTIMIZATION_THRESHOLD * 2) {
    return {
      smallGridVisible: true,
      smallGridInterval: 5 // Show every 5th small grid line
    };
  } else {
    return {
      smallGridVisible: true,
      smallGridInterval: 2 // Show every 2nd small grid line
    };
  }
};
