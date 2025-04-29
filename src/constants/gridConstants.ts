
// Grid configuration constants
export const DEFAULT_GRID_SIZE = 20;
export const MAJOR_GRID_INTERVAL = 100;
export const DEFAULT_GRID_COLOR = '#e0e0e0';
export const MAJOR_GRID_COLOR = '#c0c0c0';
export const DEFAULT_GRID_OPACITY = 0.5;
export const MAJOR_GRID_OPACITY = 1.0;

// Export constants used by other components
export const SMALL_GRID_SIZE = DEFAULT_GRID_SIZE;
export const LARGE_GRID_SIZE = MAJOR_GRID_INTERVAL;
export const SMALL_GRID_COLOR = DEFAULT_GRID_COLOR;
export const LARGE_GRID_COLOR = MAJOR_GRID_COLOR;
export const SMALL_GRID_WIDTH = DEFAULT_GRID_OPACITY;
export const LARGE_GRID_WIDTH = MAJOR_GRID_OPACITY;
export const PIXELS_PER_METER = 100;

// Add GRID_CONSTANTS for compatibility with components that use it
export const GRID_CONSTANTS = {
  DEFAULT: {
    SIZE: DEFAULT_GRID_SIZE,
    COLOR: DEFAULT_GRID_COLOR,
    WIDTH: DEFAULT_GRID_OPACITY
  },
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

// Add GridSize type for components that use it
export type GridSize = typeof SMALL_GRID_SIZE | typeof LARGE_GRID_SIZE;
