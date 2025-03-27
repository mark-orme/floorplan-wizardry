
/**
 * Drawing constants used throughout the application
 * @module constants/drawingConstants
 */

/**
 * Line thickness constants
 * @constant {Object}
 */
export const LINE_THICKNESS = {
  /**
   * Default line thickness in pixels
   * @constant {number}
   */
  DEFAULT: 2,
  
  /**
   * Minimum allowed line thickness
   * @constant {number}
   */
  MIN: 1,
  
  /**
   * Maximum allowed line thickness
   * @constant {number}
   */
  MAX: 10,
  
  /**
   * Thin line thickness
   * @constant {number}
   */
  THIN: 1,
  
  /**
   * Medium line thickness
   * @constant {number}
   */
  MEDIUM: 2,
  
  /**
   * Thick line thickness
   * @constant {number}
   */
  THICK: 4,
  
  /**
   * Very thick line thickness
   * @constant {number}
   */
  VERY_THICK: 6
};

/**
 * Path processing constants
 * @constant {Object}
 */
export const PATH_PROCESSING = {
  /**
   * Minimum points required for a valid path
   * @constant {number}
   */
  MIN_POINTS: 2,
  
  /**
   * Default sampling interval for path points
   * @constant {number}
   */
  SAMPLING_INTERVAL: 5,
  
  /**
   * Maximum points allowed in a single path for performance
   * @constant {number}
   */
  MAX_POINTS: 1000,
  
  /**
   * Minimum distance between points for simplification
   * @constant {number}
   */
  MIN_DISTANCE: 5,
  
  /**
   * Maximum processing time in milliseconds
   * @constant {number}
   */
  MAX_PROCESSING_TIME: 500
};

/**
 * Drawing state constants
 * @constant {Object}
 */
export const DRAWING_STATE = {
  /**
   * Initial zoom level
   * @constant {number}
   */
  INITIAL_ZOOM: 1,
  
  /**
   * Default tool selection
   * @constant {string}
   */
  DEFAULT_TOOL: "select" as const,
  
  /**
   * Default floor number
   * @constant {number}
   */
  DEFAULT_FLOOR: 0,
  
  /**
   * Maximum number of floors allowed
   * @constant {number}
   */
  MAX_FLOORS: 20,
  
  /**
   * Default color for new drawings
   * @constant {string}
   */
  DEFAULT_COLOR: "#000000"
};
