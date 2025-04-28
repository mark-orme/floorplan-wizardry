
// Grid dimensions
export const SMALL_GRID_SIZE = 50;
export const LARGE_GRID_SIZE = 250;

// Grid line styling
export const SMALL_GRID_COLOR = '#e0e0e0';
export const LARGE_GRID_COLOR = '#c0c0c0';
export const SMALL_GRID_WIDTH = 0.5;
export const LARGE_GRID_WIDTH = 1;

// Group all constants for easy export
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE,
  LARGE_GRID_SIZE,
  SMALL_GRID_COLOR,
  LARGE_GRID_COLOR,
  SMALL_GRID_WIDTH,
  LARGE_GRID_WIDTH,
  DEFAULT_GRID_SIZE: 50,
  DEFAULT_GRID_COLOR: 'rgba(200, 200, 200, 0.2)',
  DEFAULT_GRID_OPACITY: 0.4,
  MAJOR_GRID_INTERVAL: 5,
  MAJOR_GRID_COLOR: 'rgba(180, 180, 180, 0.5)',
  MAJOR_GRID_OPACITY: 0.6,
  // Add these properties to fix the errors
  SMALL: {
    SIZE: 50,
    COLOR: '#e0e0e0',
    WIDTH: 0.5
  },
  LARGE: {
    SIZE: 250,
    COLOR: '#c0c0c0', 
    WIDTH: 1
  }
};
