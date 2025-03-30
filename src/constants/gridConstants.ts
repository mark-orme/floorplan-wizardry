
/**
 * Grid Constants
 * Centralized configuration for grid rendering and behavior
 * @module constants/gridConstants
 */

export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 100,
  
  // Grid colors
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  
  // Grid line widths
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  
  // Canvas size limits
  MIN_CANVAS_WIDTH: 400,
  MIN_CANVAS_HEIGHT: 300,
  
  // Grid creation attempts
  MAX_ATTEMPTS: 3,
  THROTTLE_TIME: 500,
  
  // Grid visibility check interval (ms)
  VISIBILITY_CHECK_INTERVAL: 3000,
  
  // Marker text
  MARKER_TEXT_SIZE: 10,
  MARKER_COLOR: '#888888',
  
  // Pixels per meter for scale
  PIXELS_PER_METER: 100,
  
  // Grid types
  SMALL_GRID: 'small',
  LARGE_GRID: 'large'
};
