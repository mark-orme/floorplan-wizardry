
/**
 * Numeric constants for the application
 * @module constants/numerics
 */

/**
 * Pixels per meter constant for coordinate conversion
 * Used to convert between meter and pixel coordinates
 */
export const PIXELS_PER_METER = 50;

/**
 * Grid spacing constants
 * Define spacing for different grid types
 */
export const GRID_SPACING = {
  /** Small grid spacing in pixels */
  SMALL: 10,
  /** Large grid spacing in pixels */
  LARGE: 50
};

// Export individual grid spacing values for easier access
export const SMALL_GRID_SPACING = GRID_SPACING.SMALL;
export const LARGE_GRID_SPACING = GRID_SPACING.LARGE;

/**
 * Grid line options
 * Define appearance for different grid lines
 */
export const SMALL_GRID = {
  /** Small grid line color */
  COLOR: '#e0e0e0',
  /** Small grid line thickness */
  WIDTH: 0.5
};

/**
 * Large grid line options
 * Define appearance for major grid lines
 */
export const LARGE_GRID = {
  /** Large grid line color */
  COLOR: '#b0b0b0',
  /** Large grid line thickness */
  WIDTH: 1
};

// Export individual grid constants for easier access
export const SMALL_GRID_COLOR = SMALL_GRID.COLOR;
export const SMALL_GRID_WIDTH = SMALL_GRID.WIDTH;
export const LARGE_GRID_COLOR = LARGE_GRID.COLOR;
export const LARGE_GRID_WIDTH = LARGE_GRID.WIDTH;

/**
 * Zoom level constants
 * Define zoom level limits and increments
 */
export const ZOOM_LEVEL_CONSTANTS = {
  /** Minimum zoom level */
  MIN: 0.5,
  /** Maximum zoom level */
  MAX: 5,
  /** Default zoom level */
  DEFAULT: 1,
  /** Zoom increment for each step */
  INCREMENT: 0.1
};

/**
 * Drawing line thickness defaults
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Canvas size defaults
 */
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * History state limits
 */
export const MAX_HISTORY_STATES = 30;
export const MAX_OBJECTS_PER_CANVAS = 1000;

/**
 * Grid performance constants
 */
export const MAX_SMALL_GRID_LINES = 1000;
export const MAX_LARGE_GRID_LINES = 200;
export const GRID_EXTENSION_FACTOR = 1.2;

/**
 * Geometry constants
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;
export const MIN_LINE_LENGTH = 5;
export const MIN_SHAPE_AREA = 10;
export const CLOSE_POINT_THRESHOLD = 10;
export const SHAPE_CLOSE_THRESHOLD = 20;
export const ANGLE_SNAP_THRESHOLD = 5;
export const LARGE_GRID_LINE_WIDTH = 1;
export const SMALL_GRID_LINE_WIDTH = 0.5;
export const AREA_PRECISION = 2;
export const DISTANCE_PRECISION = 2;
