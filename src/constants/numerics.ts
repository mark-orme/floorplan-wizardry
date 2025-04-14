
/**
 * Numeric constants used throughout the application
 * @module constants/numerics
 */

// Grid spacing constants
export const GRID_SPACING = {
  SMALL: 10,   // 10px grid (0.1m at 100px/m scale)
  MEDIUM: 50,  // 50px grid (0.5m at 100px/m scale)
  LARGE: 100,  // 100px grid (1m at 100px/m scale)
  DEFAULT: 20  // Default grid spacing when not specified
};

// Scale conversions
export const PIXELS_PER_METER = 100;

// Grid snap threshold in pixels
export const SNAP_THRESHOLD = 5;

// Angle snap threshold in degrees
export const ANGLE_SNAP_THRESHOLD = 5;

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

// Grid line widths
export const SMALL_GRID_LINE_WIDTH = 0.7;
export const LARGE_GRID_LINE_WIDTH = 1.0;

// Precision settings
export const AREA_PRECISION = 2;
export const DISTANCE_PRECISION = 2;

// Tolerance for floating point comparisons
export const FLOATING_POINT_TOLERANCE = 0.0001;

// Minimum values for geometry operations
export const MIN_LINE_LENGTH = 5;
export const MIN_SHAPE_AREA = 100;

// Thresholds for close operations
export const CLOSE_POINT_THRESHOLD = 5;
export const SHAPE_CLOSE_THRESHOLD = 10;

// History and performance constraints
export const MAX_HISTORY_STATES = 50;
export const MAX_OBJECTS_PER_CANVAS = 1000;

// Grid limits
export const MAX_SMALL_GRID_LINES = 1000;
export const MAX_LARGE_GRID_LINES = 200;
export const GRID_EXTENSION_FACTOR = 1.5;

// Zoom constraints
export const ZOOM_CONSTRAINTS = {
  MIN: 0.1,
  MAX: 10,
  DEFAULT: 1,
  STEP: 0.1
};
