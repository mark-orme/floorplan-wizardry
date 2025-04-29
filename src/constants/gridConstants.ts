
/**
 * Grid constants
 */
export const SMALL_GRID_SIZE = 20;
export const LARGE_GRID_SIZE = 100;
export const SMALL_GRID_COLOR = '#e0e0e0';
export const LARGE_GRID_COLOR = '#c0c0c0';
export const SMALL_GRID_WIDTH = 0.5;
export const LARGE_GRID_WIDTH = 1;

export const GRID_CONSTANTS = {
  SMALL: {
    SIZE: SMALL_GRID_SIZE,
    COLOR: SMALL_GRID_COLOR,
    WIDTH: SMALL_GRID_WIDTH,
  },
  LARGE: {
    SIZE: LARGE_GRID_SIZE,
    COLOR: LARGE_GRID_COLOR,
    WIDTH: LARGE_GRID_WIDTH,
  },
  GRID_SIZE: SMALL_GRID_SIZE, // Default grid size
};

// Export a single grid size constant for backward compatibility
export const GRID_SIZE = SMALL_GRID_SIZE;
