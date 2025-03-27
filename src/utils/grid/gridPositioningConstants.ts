
/**
 * Grid positioning constants
 * Defines constants used for grid placement and alignment
 * @module grid/gridPositioningConstants
 */

/**
 * Grid offset factor - determines how far the grid extends beyond canvas edges
 * 0.25 means grid starts at -25% of canvas width/height
 * @constant {number}
 */
export const GRID_OFFSET_FACTOR = 0.25;

/**
 * Grid snapping tolerance in pixels
 * How close a point must be to a grid line to snap to it
 * @constant {number}
 */
export const GRID_SNAP_TOLERANCE = 5;

/**
 * Large grid snap priority factor
 * Increases the snapping priority for large grid lines
 * @constant {number}
 */
export const LARGE_GRID_PRIORITY = 2;

/**
 * Path processing constants
 * Settings for processing drawn paths on the canvas
 * @constant {Object}
 */
export const PATH_PROCESSING = {
  /**
   * Minimum number of points threshold
   * Paths with fewer points than this are not filtered
   * @constant {number}
   */
  MIN_POINTS_THRESHOLD: 5,
  
  /**
   * Path point sampling divisor
   * Used to sample points from long paths by taking every Nth point
   * @constant {number}
   */
  SAMPLING_DIVISOR: 10,
  
  /**
   * Maximum allowed points in a path
   * Paths with more points than this will be simplified
   * @constant {number}
   */
  MAX_POINTS: 200,
  
  /**
   * Minimum path length in pixels for processing
   * Paths shorter than this are ignored
   * @constant {number}
   */
  MIN_PATH_LENGTH: 5
};
