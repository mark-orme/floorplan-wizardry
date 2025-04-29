
/**
 * Grid rendering constants
 */

// Grid sizes in pixels
export const SMALL_GRID_SIZE = 10;
export const LARGE_GRID_SIZE = 50;

// Grid colors
export const SMALL_GRID_COLOR = '#e5e5e5';
export const LARGE_GRID_COLOR = '#cccccc';

// Grid line widths
export const SMALL_GRID_WIDTH = 0.2;
export const LARGE_GRID_WIDTH = 0.5;

export const GRID_CONSTANTS = {
  DEFAULT_GRID_SIZE: 50,
  DEFAULT_GRID_COLOR: 'rgba(200, 200, 200, 0.2)',
  DEFAULT_GRID_OPACITY: 0.4,
  MAJOR_GRID_INTERVAL: 5,
  MAJOR_GRID_COLOR: 'rgba(180, 180, 180, 0.5)',
  MAJOR_GRID_OPACITY: 0.6,
  LARGE: {
    COLOR: '#cccccc',
    WIDTH: 0.5
  },
  SMALL: {
    COLOR: '#e5e5e5',
    WIDTH: 0.2
  }
};

// Add GridSize enum for consistent sizing references
export enum GridSize {
  SMALL = 10,
  LARGE = 50
}
