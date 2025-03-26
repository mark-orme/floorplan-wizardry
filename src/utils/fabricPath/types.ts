
/**
 * Types for Fabric.js path utilities
 * @module fabricPath/types
 */

/**
 * Path command types used in fabricPathToPoints
 */
export const PATH_COMMANDS = {
  /**
   * Move to command
   * @constant {string}
   */
  MOVE_TO: 'M',
  
  /**
   * Line to command
   * @constant {string}
   */
  LINE_TO: 'L',
  
  /**
   * Quadratic curve command
   * @constant {string}
   */
  QUADRATIC_CURVE: 'Q',
  
  /**
   * Bezier curve command
   * @constant {string}
   */
  BEZIER_CURVE: 'C'
};

/**
 * Command index constants for accessing path data
 */
export const COMMAND_INDICES = {
  /**
   * Index of command type in path command array
   * @constant {number}
   */
  COMMAND_TYPE: 0,
  
  /**
   * Index of first coordinate in path command array
   * @constant {number}
   */
  FIRST_COORD: 1,
  
  /**
   * Index of second coordinate in path command array
   * @constant {number}
   */
  SECOND_COORD: 2,
  
  /**
   * Index of quadratic curve end x-coordinate
   * @constant {number}
   */
  QUAD_END_X: 3,
  
  /**
   * Index of quadratic curve end y-coordinate
   * @constant {number}
   */
  QUAD_END_Y: 4,
  
  /**
   * Index of bezier curve end x-coordinate
   * @constant {number}
   */
  BEZIER_END_X: 5,
  
  /**
   * Index of bezier curve end y-coordinate
   * @constant {number}
   */
  BEZIER_END_Y: 6
};

/**
 * Path processing constants
 */
export const PATH_CONSTANTS = {
  /**
   * Minimum distance between points to consider them separate (in meters)
   * Used for filtering out redundant points
   * @constant {number}
   */
  MIN_POINT_DISTANCE: 0.05,
  
  /**
   * Minimum distance between points in pixels
   * Used for cleanPathData function
   * @constant {number}
   */
  MIN_PIXEL_DISTANCE: 5,
  
  /**
   * Minimal offset for single-point paths
   * When a path has only one point, this offset creates a second point
   * @constant {number}
   */
  SINGLE_POINT_OFFSET: 0.1
};

/**
 * Type for path command
 */
export type PathCommand = (string | number)[];
