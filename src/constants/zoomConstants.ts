
/**
 * Zoom-related constants used throughout the application
 * Controls zoom behavior and limits for the canvas
 * @module constants/zoomConstants
 */

/**
 * Zoom multiplier constants for zooming in and out
 * Controls the rate and limits of zoom operations
 * @constant {Object}
 */
export const ZOOM_MULTIPLIERS = {
  /**
   * Zoom in multiplier value
   * Each zoom-in operation multiplies the current zoom by this value
   * @constant {number}
   */
  IN: 1.2,
  
  /**
   * Zoom out multiplier value
   * Each zoom-out operation multiplies the current zoom by this value
   * @constant {number}
   */
  OUT: 0.8,
  
  /**
   * Minimum allowed zoom level
   * Prevents zooming out too far where content becomes unreadable
   * @constant {number}
   */
  MIN_ZOOM: 0.5,
  
  /**
   * Maximum allowed zoom level
   * Prevents excessive zooming that could cause performance issues
   * @constant {number}
   */
  MAX_ZOOM: 5.0,
  
  /**
   * Default initial zoom level
   * Standard 1:1 display ratio when canvas is first loaded
   * @constant {number}
   */
  DEFAULT_ZOOM: 1.0
};

/**
 * Zoom direction type definition
 * Represents the two possible zoom directions
 * @typedef {"in" | "out"} ZoomDirection
 */
export type ZoomDirection = "in" | "out";
