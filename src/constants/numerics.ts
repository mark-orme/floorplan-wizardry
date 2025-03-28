
/**
 * Numeric constants for the application
 * @module constants/numerics
 */

// Canvas dimensions
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

// Zoom constraints
export const ZOOM_CONSTRAINTS = {
  MIN: 0.2,
  MAX: 5.0,
  DEFAULT: 1.0,
  STEP: 0.1
};

// Grid spacing
export const GRID_SPACING = {
  SMALL: 10,
  LARGE: 50,
  DEFAULT: 10
};

// Grid constants
export const MAX_SMALL_GRID_LINES = 1000;
export const MAX_LARGE_GRID_LINES = 200;
export const GRID_EXTENSION_FACTOR = 1.5;
export const LARGE_GRID_LINE_WIDTH = 1.0;
export const SMALL_GRID_LINE_WIDTH = 0.5;

// Snapping thresholds
export const SNAP_THRESHOLD = 5;
export const ANGLE_SNAP_THRESHOLD = 5;

// Precision settings
export const FLOATING_POINT_TOLERANCE = 0.001;
export const MIN_LINE_LENGTH = 5;
export const MIN_SHAPE_AREA = 25;
export const CLOSE_POINT_THRESHOLD = 10;
export const SHAPE_CLOSE_THRESHOLD = 15;
export const DISTANCE_PRECISION = 2;
export const AREA_PRECISION = 2;

// History settings
export const MAX_HISTORY_STATES = 100;
