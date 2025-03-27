
/**
 * Constants for zoom operations
 * @module constants/zoomConstants
 */

/**
 * Zoom level constants
 */
export const ZOOM_CONSTANTS = {
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 10.0,
  
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Zoom increment for keyboard operations */
  ZOOM_INCREMENT: 0.1,
  
  /** Zoom increment for wheel operations */
  WHEEL_ZOOM_FACTOR: 0.05
};

/**
 * Zoom direction type
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom multipliers for different operations
 */
export const ZOOM_MULTIPLIERS = {
  /** Zoom in multiplier */
  IN: 1.2,
  
  /** Zoom out multiplier */
  OUT: 0.8,
  
  /** Small zoom in step */
  SMALL_IN: 1.05,
  
  /** Small zoom out step */
  SMALL_OUT: 0.95
};
