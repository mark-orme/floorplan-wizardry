
/**
 * Constants for zoom settings and behaviors
 * Used to maintain consistent zooming across components
 */
export const ZOOM_CONSTANTS = {
  /** Zoom in factor */
  IN: 1.1,
  
  /** Zoom out factor */
  OUT: 0.9,
  
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  
  /** Maximum zoom level */
  MAX_ZOOM: 10.0,
  
  /** Default zoom level */
  DEFAULT_ZOOM: 1.0,
  
  /** Zoom increment for buttons and controls */
  ZOOM_INCREMENT: 0.1,
  
  /** Number of zoom steps from min to max */
  ZOOM_STEPS: 20,
  
  /** Zoom sensitivity for mouse wheel */
  WHEEL_SENSITIVITY: 0.001,
  
  /** Transition duration for zoom animations in ms */
  TRANSITION_DURATION: 300
};

/**
 * Zoom direction type for zoom operations
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom multipliers for consistent zoom operations
 */
export const ZOOM_MULTIPLIERS = {
  IN: 1.1,
  OUT: 0.9
};
