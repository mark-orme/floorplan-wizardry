
/**
 * Grid constants
 * Provides consistent grid configuration values
 * @module constants/gridConstants
 */

export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  
  // Grid colors
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  MAJOR_GRID_COLOR: '#a0a0a0', // Added for major grid lines
  
  // Line widths
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  
  // Canvas minimum dimensions
  MIN_CANVAS_WIDTH: 200,
  MIN_CANVAS_HEIGHT: 200,
  
  // Grid types
  SMALL_GRID: 'small',
  LARGE_GRID: 'large',
  
  // For backwards compatibility
  GRID_SIZE: 10,
  GRID_COLOR: '#e0e0e0',
  
  // Render limits
  MAX_GRID_LINES: 100,
  MAX_OBJECTS_PER_CANVAS: 5000,
  
  // Performance
  GRID_RENDER_THROTTLE: 300,
  GRID_CHECK_INTERVAL: 2000
};

// Export for legacy compatibility
export const DEFAULT_GRID_SIZE = GRID_CONSTANTS.SMALL_GRID_SIZE;
export const DEFAULT_GRID_COLOR = GRID_CONSTANTS.SMALL_GRID_COLOR;
