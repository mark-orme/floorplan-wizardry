
/**
 * Numerical constants used throughout the application
 * @module constants/numerics
 */

// Canvas and rendering constants
export const PIXELS_PER_METER = 100; // 100 pixels = 1 meter
export const GRID_SPACING = 20; // Grid line every 20 pixels
export const SMALL_GRID = 20; // Small grid cells (20px)
export const LARGE_GRID = 100; // Large grid cells (100px)

// Add properties to the numeric constants to fix typing issues
export const SMALL_GRID_PROPS = {
  SMALL: 20,
  DEFAULT: 20
};

export const LARGE_GRID_PROPS = {
  LARGE: 100,
  DEFAULT: 100
};

// History state management
export const MAX_HISTORY_STATES = 50;
export const MAX_OBJECTS_PER_CANVAS = 1000;

// Drawing defaults
export const DEFAULT_LINE_THICKNESS = 2;

// Precision for area calculations
export const AREA_PRECISION = 2; // Number of decimal places
export const DISTANCE_PRECISION = 1; // Number of decimal places for distance

// Tolerance values
export const FLOATING_POINT_TOLERANCE = 0.001;
export const MIN_LINE_LENGTH = 5;
export const MIN_SHAPE_AREA = 100;
export const CLOSE_POINT_THRESHOLD = 5;
export const SHAPE_CLOSE_THRESHOLD = 10;
export const SNAP_THRESHOLD = 10;

// Grid line widths
export const LARGE_GRID_LINE_WIDTH = 1.0;
export const SMALL_GRID_LINE_WIDTH = 0.7;

// Angle constraints
export const STANDARD_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
export const ANGLE_SNAP_THRESHOLD = 5;

// Zoom constraints
export const ZOOM_CONSTRAINTS = {
  MIN: 0.5,
  MAX: 3.0,
  DEFAULT: 1.0
};
