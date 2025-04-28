
/**
 * Grid constants for visual representations
 */

// Small grid
export const SMALL_GRID_SIZE = 20;
export const SMALL_GRID_COLOR = '#e0e0e0';
export const SMALL_GRID_WIDTH = 0.5;

// Large grid (every 5 small grid lines)
export const LARGE_GRID_SIZE = 100; // 5 * SMALL_GRID_SIZE
export const LARGE_GRID_COLOR = '#c0c0c0';
export const LARGE_GRID_WIDTH = 1;

// Export as a single object for easier importing
export const GRID_CONSTANTS = {
  SMALL: {
    SIZE: SMALL_GRID_SIZE,
    COLOR: SMALL_GRID_COLOR,
    WIDTH: SMALL_GRID_WIDTH
  },
  LARGE: {
    SIZE: LARGE_GRID_SIZE,
    COLOR: LARGE_GRID_COLOR,
    WIDTH: LARGE_GRID_WIDTH
  }
};
