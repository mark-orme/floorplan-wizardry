
/**
 * Constants for zoom operations
 * @module constants/zoomConstants
 */

/**
 * Type for zoom direction
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom level constants
 */
export const ZOOM_LEVEL_CONSTANTS = {
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 10.0,
  
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Zoom increment */
  ZOOM_INCREMENT: 0.1
};

/**
 * Zoom multiplier constants
 */
export const ZOOM_MULTIPLIERS = {
  /** Zoom in multiplier */
  IN: 1.2,
  
  /** Zoom out multiplier */
  OUT: 0.8,
  
  /** Reset zoom level */
  RESET: 1.0
};

/**
 * Constants for zoom behaviors
 */
export const ZOOM_CONSTANTS = {
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Zoom in factor */
  IN: 1.2,
  
  /** Zoom out factor */
  OUT: 0.8,
  
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 10.0
};
