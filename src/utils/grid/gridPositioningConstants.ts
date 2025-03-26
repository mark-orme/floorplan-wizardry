
/**
 * Grid positioning constants
 * Defines constants for grid layout and positioning calculations
 * @module grid/gridPositioningConstants
 */

/**
 * Grid extension offset factor
 * Used to calculate how far off-canvas the grid should extend
 * @constant {number}
 */
export const GRID_OFFSET_FACTOR = 0.25; // Represents 1/4

/**
 * Small grid density divisor
 * Used in density calculations for small grid lines
 * @constant {number}
 */
export const SMALL_GRID_DENSITY_DIVISOR = 300;

/**
 * Large grid density divisor
 * Used in density calculations for large grid lines
 * @constant {number}
 */
export const LARGE_GRID_DENSITY_DIVISOR = 1500;

/**
 * Scale marker positioning constants
 * For consistent positioning of scale indicators
 */
export const SCALE_MARKER = {
  /**
   * Horizontal offset from right edge for scale marker line start
   * @constant {number}
   */
  HORIZONTAL_OFFSET_START: 120,
  
  /**
   * Vertical offset from bottom edge for scale marker
   * @constant {number}
   */
  VERTICAL_OFFSET: 30,
  
  /**
   * Horizontal offset from right edge for scale marker line end
   * @constant {number}
   */
  HORIZONTAL_OFFSET_END: 20,
  
  /**
   * Horizontal offset from right edge for scale marker text
   * @constant {number}
   */
  TEXT_HORIZONTAL_OFFSET: 70,
  
  /**
   * Vertical offset from bottom edge for scale marker text
   * @constant {number}
   */
  TEXT_VERTICAL_OFFSET: 45,
  
  /**
   * Font size for scale marker text
   * @constant {number}
   */
  FONT_SIZE: 16,
  
  /**
   * Line width for scale marker
   * @constant {number}
   */
  LINE_WIDTH: 3,
  
  /**
   * Background opacity for scale marker text
   * @constant {number}
   */
  BACKGROUND_OPACITY: 0.7
};

/**
 * Path processing constants
 * Used for filtering and processing path points
 */
export const PATH_PROCESSING = {
  /**
   * Minimum points threshold for detailed filtering
   * @constant {number}
   */
  MIN_POINTS_THRESHOLD: 4,
  
  /**
   * Sampling divisor for path point reduction
   * @constant {number}
   */
  SAMPLING_DIVISOR: 10,
  
  /**
   * Maximum points per path for optimal performance
   * @constant {number}
   */
  MAX_POINTS_PER_PATH: 500,
  
  /**
   * Distance threshold for point simplification
   * @constant {number}
   */
  SIMPLIFICATION_THRESHOLD: 2
};

/**
 * Grid performance thresholds for adaptive rendering
 */
export const GRID_PERFORMANCE = {
  /**
   * Canvas area threshold for reducing small grid density
   * @constant {number}
   */
  REDUCE_SMALL_GRID_THRESHOLD: 4000000,
  
  /**
   * Canvas area threshold for disabling small grid
   * @constant {number}
   */
  DISABLE_SMALL_GRID_THRESHOLD: 8000000,
  
  /**
   * Canvas area threshold for reducing large grid density
   * @constant {number}
   */
  REDUCE_LARGE_GRID_THRESHOLD: 10000000
};
