
/**
 * Constants for grid positioning and path processing
 * @module grid/gridPositioningConstants
 */

/**
 * Grid positioning constants
 */
export const GRID_POSITIONING = {
  /**
   * Grid offset factor for positioning calculations
   * This determines how far the grid extends beyond canvas edges
   * @constant {number}
   */
  OFFSET_FACTOR: 0.5
};

/**
 * Path processing thresholds and limits
 */
export const PATH_PROCESSING = {
  /**
   * Minimum number of points threshold before sampling
   * @constant {number}
   */
  MIN_POINTS_THRESHOLD: 10,
  
  /**
   * Divisor used for point sampling
   * Controls how many points are kept when simplifying paths
   * @constant {number}
   */
  SAMPLING_DIVISOR: 5,
  
  /**
   * Minimum distance between points in pixels
   * Points closer than this may be merged
   * @constant {number}
   */
  MIN_DISTANCE: 5
};

// For backward compatibility
export const GRID_OFFSET_FACTOR = GRID_POSITIONING.OFFSET_FACTOR;
