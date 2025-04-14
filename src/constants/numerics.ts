
/**
 * Numeric constants used throughout the application
 * @module constants/numerics
 */

// Grid spacing constants
export const GRID_SPACING = {
  SMALL: 10,   // 10px grid (0.1m at 100px/m scale)
  MEDIUM: 50,  // 50px grid (0.5m at 100px/m scale)
  LARGE: 100   // 100px grid (1m at 100px/m scale)
};

// Scale conversions
export const PIXELS_PER_METER = 100;

// Grid snap threshold in pixels
export const SNAP_THRESHOLD = 5;

// Default line properties
export const DEFAULT_LINE_THICKNESS = 2;
export const DEFAULT_LINE_COLOR = "#000000";

// Small grid (major grid)
export const SMALL_GRID = GRID_SPACING.SMALL;

// Large grid (minor grid)
export const LARGE_GRID = GRID_SPACING.LARGE;

// Grid colors
export const SMALL_GRID_COLOR = "#cccccc";
export const LARGE_GRID_COLOR = "#aaaaaa";

// Default geometry
export const DEFAULT_WALL_THICKNESS = 5;
export const DEFAULT_POINT_RADIUS = 4;
