
/**
 * Constants for zoom operations
 * Used to maintain consistent zoom behavior
 */
export const ZOOM_CONSTANTS = {
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Minimum zoom level allowed */
  MIN_ZOOM: 0.25,
  
  /** Maximum zoom level allowed */
  MAX_ZOOM: 5.0,
  
  /** Zoom step for keyboard and button controls */
  ZOOM_STEP: 0.1,
  
  /** Zoom multiplier for mouse wheel operations */
  WHEEL_ZOOM_FACTOR: 0.02,
  
  /** Zoom multiplier for pinch gesture operations */
  PINCH_ZOOM_FACTOR: 0.01,
  
  /** Default zoom transition duration in milliseconds */
  TRANSITION_DURATION: 200,
  
  /** Maximum zoom change per interaction */
  MAX_ZOOM_CHANGE: 0.5
};

/**
 * Zoom directions for zoom operations
 */
export enum ZoomDirection {
  /** Zoom in (increase scale) */
  IN = "in",
  
  /** Zoom out (decrease scale) */
  OUT = "out"
}

/**
 * Zoom multipliers for different operations
 */
export const ZOOM_MULTIPLIERS = {
  /** Zoom in multiplier */
  IN: 1.1,
  
  /** Zoom out multiplier */
  OUT: 0.9
};
