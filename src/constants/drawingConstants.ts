
/**
 * Drawing constants used throughout the application
 * Defines parameters for line styling and path processing
 * @module constants/drawingConstants
 */

/**
 * Line thickness constants
 * Defines standard line thickness values for drawing
 * @constant {Object}
 */
export const LINE_THICKNESS = {
  /**
   * Default line thickness in pixels
   * Standard thickness for new drawings
   * @constant {number}
   */
  DEFAULT: 2,
  
  /**
   * Minimum allowed line thickness
   * Prevents lines from being too thin to be visible
   * @constant {number}
   */
  MIN: 1,
  
  /**
   * Maximum allowed line thickness
   * Prevents excessive line thickness that would obscure details
   * @constant {number}
   */
  MAX: 10,
  
  /**
   * Thin line thickness
   * For detailed or fine drawings
   * @constant {number}
   */
  THIN: 1,
  
  /**
   * Medium line thickness
   * Standard thickness for most drawings
   * @constant {number}
   */
  MEDIUM: 2,
  
  /**
   * Thick line thickness
   * For emphasis or primary elements
   * @constant {number}
   */
  THICK: 4,
  
  /**
   * Very thick line thickness
   * For strong emphasis or high visibility
   * @constant {number}
   */
  VERY_THICK: 6
};

/**
 * Path processing constants
 * Parameters for handling and optimizing drawing paths
 * @constant {Object}
 */
export const PATH_PROCESSING = {
  /**
   * Minimum points required for a valid path
   * A path needs at least two points to form a line
   * @constant {number}
   */
  MIN_POINTS: 2,
  
  /**
   * Default sampling interval for path points
   * Controls how many points are kept when simplifying paths
   * @constant {number}
   */
  SAMPLING_INTERVAL: 5,
  
  /**
   * Maximum points allowed in a single path for performance
   * Prevents excessive points that could impact rendering speed
   * @constant {number}
   */
  MAX_POINTS: 1000,
  
  /**
   * Minimum distance between points for simplification
   * Points closer than this are candidates for removal during simplification
   * @constant {number}
   */
  MIN_DISTANCE: 5,
  
  /**
   * Maximum processing time in milliseconds
   * Limits how long path processing can take to maintain responsiveness
   * @constant {number}
   */
  MAX_PROCESSING_TIME: 500
};

/**
 * Drawing state constants
 * Default values for the drawing environment
 * @constant {Object}
 */
export const DRAWING_STATE = {
  /**
   * Initial zoom level
   * Default zoom when first loading the canvas
   * @constant {number}
   */
  INITIAL_ZOOM: 1,
  
  /**
   * Default tool selection
   * Tool activated when first loading the application
   * @constant {string}
   */
  DEFAULT_TOOL: "select" as const,
  
  /**
   * Default floor number
   * Initial floor shown in multi-floor plans
   * @constant {number}
   */
  DEFAULT_FLOOR: 0,
  
  /**
   * Maximum number of floors allowed
   * Limits to prevent excessive memory usage with many floors
   * @constant {number}
   */
  MAX_FLOORS: 20,
  
  /**
   * Default color for new drawings
   * Standard color used for new drawing operations
   * @constant {string}
   */
  DEFAULT_COLOR: "#000000"
};
