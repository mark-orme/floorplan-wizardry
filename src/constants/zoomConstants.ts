
/**
 * Zoom-related constants used throughout the application
 * @module constants/zoomConstants
 */

/**
 * Zoom multiplier constants for zooming in and out
 * @constant {Object}
 */
export const ZOOM_MULTIPLIERS = {
  /**
   * Zoom in multiplier value
   * @constant {number}
   */
  IN: 1.2,
  
  /**
   * Zoom out multiplier value
   * @constant {number}
   */
  OUT: 0.8,
  
  /**
   * Minimum allowed zoom level
   * @constant {number}
   */
  MIN_ZOOM: 0.5,
  
  /**
   * Maximum allowed zoom level
   * @constant {number}
   */
  MAX_ZOOM: 5.0,
  
  /**
   * Default initial zoom level
   * @constant {number}
   */
  DEFAULT_ZOOM: 1.0
};

/**
 * Zoom direction type
 * @typedef {"in" | "out"} ZoomDirection
 */
export type ZoomDirection = "in" | "out";
