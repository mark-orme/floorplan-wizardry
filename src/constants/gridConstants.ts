
export enum GridSize {
  SMALL = 8,
  LARGE = 32
}

export const GRID_CONSTANTS = {
  DEFAULT_GRID_SIZE: 50,
  DEFAULT_GRID_COLOR: 'rgba(200, 200, 200, 0.2)',
  DEFAULT_GRID_OPACITY: 0.4,
  MAJOR_GRID_INTERVAL: 5,
  MAJOR_GRID_COLOR: 'rgba(180, 180, 180, 0.5)',
  MAJOR_GRID_OPACITY: 0.6,
  SMALL_GRID_SIZE: 8,
  LARGE_GRID_SIZE: 32,
  LARGE: {
    COLOR: 'rgba(180, 180, 180, 0.5)',
    WIDTH: 1
  },
  SMALL: {
    COLOR: 'rgba(200, 200, 200, 0.2)',
    WIDTH: 0.5
  }
};

// Export these for backward compatibility with older imports
export const SMALL_GRID_SIZE = 8;
export const LARGE_GRID_SIZE = 32;
export const SMALL_GRID_COLOR = 'rgba(200, 200, 200, 0.2)';
export const LARGE_GRID_COLOR = 'rgba(180, 180, 180, 0.5)';
export const SMALL_GRID_WIDTH = 0.5;
export const LARGE_GRID_WIDTH = 1;
