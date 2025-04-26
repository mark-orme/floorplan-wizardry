
/**
 * Grid Constants
 * Constants used for grid creation and management
 * @module constants/gridConstants
 */

export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  
  // Grid line widths
  SMALL_GRID_WIDTH: 1,
  LARGE_GRID_WIDTH: 1.5,
  
  // Grid colors
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#d0d0d0',
  
  // Grid opacity
  SMALL_GRID_OPACITY: 0.4,
  LARGE_GRID_OPACITY: 0.6,
  
  // Grid update interval
  GRID_UPDATE_INTERVAL: 500,
  
  // Grid validation
  MIN_GRID_SIZE: 5,
  MAX_GRID_SIZE: 500
};

// Re-export individual constants
export const SMALL_GRID_SIZE = GRID_CONSTANTS.SMALL_GRID_SIZE;
export const LARGE_GRID_SIZE = GRID_CONSTANTS.LARGE_GRID_SIZE;
export const SMALL_GRID_WIDTH = GRID_CONSTANTS.SMALL_GRID_WIDTH;
export const LARGE_GRID_WIDTH = GRID_CONSTANTS.LARGE_GRID_WIDTH;
export const SMALL_GRID_COLOR = GRID_CONSTANTS.SMALL_GRID_COLOR;
export const LARGE_GRID_COLOR = GRID_CONSTANTS.LARGE_GRID_COLOR;
