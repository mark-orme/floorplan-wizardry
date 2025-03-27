
/**
 * Numeric constants for the application
 */

/**
 * Pixel to meter conversion constants
 */
export const CONVERSION = {
  /** 
   * Number of pixels per meter (for scale calculations)
   * @type {number}
   */
  PIXELS_PER_METER: 100,
  
  /**
   * Number of small grid units per large grid unit
   * @type {number}
   */
  SMALL_TO_LARGE_RATIO: 10,
  
  /**
   * Grid extension multiplier beyond visible area
   * @type {number}
   */
  GRID_EXTENSION_FACTOR: 2.0
};

/**
 * Grid spacing constants
 */
export const GRID = {
  /**
   * Default grid spacing in pixels
   * @type {number}
   */
  SPACING: 100,

  /**
   * Small grid spacing in pixels (0.1m)
   * @type {number}
   */
  SMALL: 10,

  /**
   * Large grid spacing in pixels (1m)
   * @type {number}
   */
  LARGE: 100,
  
  /**
   * Major grid spacing (equivalent to LARGE_GRID)
   * @type {number}
   */
  MAJOR_SPACING: 100
};

/**
 * Line constants
 */
export const LINE = {
  /**
   * Default line thickness for drawing in pixels
   * @type {number}
   */
  DEFAULT_THICKNESS: 2
};

/**
 * History constants
 */
export const HISTORY = {
  /**
   * Maximum number of history states for undo/redo
   * @type {number}
   */
  MAX_STATES: 50
};

/**
 * Performance thresholds
 */
export const PERFORMANCE = {
  /**
   * Maximum number of objects per canvas for performance
   * @type {number}
   */
  MAX_OBJECTS: 5000,
  
  /**
   * Maximum number of small grid lines for performance
   * @type {number}
   */
  MAX_SMALL_GRID_LINES: 500,

  /**
   * Maximum number of large grid lines for performance
   * @type {number}
   */
  MAX_LARGE_GRID_LINES: 100
};

/**
 * Tolerance constants
 */
export const TOLERANCE = {
  /**
   * Floating point calculation tolerance
   * @type {number}
   */
  FLOATING_POINT: 0.0001
};

/**
 * Threshold constants
 */
export const THRESHOLD = {
  /**
   * Minimum line length in pixels to be considered a valid line
   * @type {number}
   */
  MIN_LINE_LENGTH: 5,

  /**
   * Minimum shape area in square pixels to be considered a valid shape
   * @type {number}
   */
  MIN_SHAPE_AREA: 100,

  /**
   * Threshold in pixels to consider points close to each other
   * @type {number}
   */
  CLOSE_POINT: 10,

  /**
   * Threshold in pixels to consider a shape closed
   * @type {number}
   */
  SHAPE_CLOSE: 15,

  /**
   * Threshold in degrees for angle snapping
   * @type {number}
   */
  ANGLE_SNAP: 5
};

/**
 * Grid line width constants
 */
export const GRID_LINE = {
  /**
   * Width of large grid lines in pixels
   * @type {number}
   */
  LARGE_WIDTH: 1.0,

  /**
   * Width of small grid lines in pixels
   * @type {number}
   */
  SMALL_WIDTH: 0.5
};

/**
 * Precision constants
 */
export const PRECISION = {
  /**
   * Number of decimal places for area calculations
   * @type {number}
   */
  AREA: 2,

  /**
   * Number of decimal places for distance measurements
   * @type {number}
   */
  DISTANCE: 2
};

/**
 * Canvas dimension constants
 */
export const CANVAS_DIMENSION = {
  /**
   * Default canvas width in pixels
   * @type {number}
   */
  DEFAULT_WIDTH: 800,

  /**
   * Default canvas height in pixels
   * @type {number}
   */
  DEFAULT_HEIGHT: 600
};

/**
 * Legacy constants for backward compatibility
 */
export const LEGACY = {
  /**
   * Canvas default width for backward compatibility
   * @type {number}
   */
  CANVAS_DEFAULT_WIDTH: 800,

  /**
   * Canvas default height for backward compatibility
   * @type {number}
   */
  CANVAS_DEFAULT_HEIGHT: 600
};

/**
 * Grid creation constants
 */
export const GRID_CREATION = {
  /**
   * Maximum number of grid creation attempts
   * @type {number}
   */
  MAX_ATTEMPTS: 3,

  /**
   * Minimum interval between grid creation attempts in ms
   * @type {number}
   */
  MIN_INTERVAL: 300
};

// For backward compatibility, also export flat constants
export const PIXELS_PER_METER = CONVERSION.PIXELS_PER_METER;
export const GRID_SPACING = GRID.SPACING;
export const SMALL_GRID = GRID.SMALL;
export const LARGE_GRID = GRID.LARGE;
export const DEFAULT_LINE_THICKNESS = LINE.DEFAULT_THICKNESS;
export const MAX_HISTORY_STATES = HISTORY.MAX_STATES;
export const MAX_OBJECTS_PER_CANVAS = PERFORMANCE.MAX_OBJECTS;
export const FLOATING_POINT_TOLERANCE = TOLERANCE.FLOATING_POINT;
export const MIN_LINE_LENGTH = THRESHOLD.MIN_LINE_LENGTH;
export const MIN_SHAPE_AREA = THRESHOLD.MIN_SHAPE_AREA;
export const CLOSE_POINT_THRESHOLD = THRESHOLD.CLOSE_POINT;
export const SHAPE_CLOSE_THRESHOLD = THRESHOLD.SHAPE_CLOSE;
export const ANGLE_SNAP_THRESHOLD = THRESHOLD.ANGLE_SNAP;
export const LARGE_GRID_LINE_WIDTH = GRID_LINE.LARGE_WIDTH;
export const SMALL_GRID_LINE_WIDTH = GRID_LINE.SMALL_WIDTH;
export const AREA_PRECISION = PRECISION.AREA;
export const DISTANCE_PRECISION = PRECISION.DISTANCE;
export const DEFAULT_CANVAS_WIDTH = CANVAS_DIMENSION.DEFAULT_WIDTH;
export const DEFAULT_CANVAS_HEIGHT = CANVAS_DIMENSION.DEFAULT_HEIGHT;
export const CANVAS_DEFAULT_WIDTH = LEGACY.CANVAS_DEFAULT_WIDTH;
export const CANVAS_DEFAULT_HEIGHT = LEGACY.CANVAS_DEFAULT_HEIGHT;
export const MAX_SMALL_GRID_LINES = PERFORMANCE.MAX_SMALL_GRID_LINES;
export const MAX_LARGE_GRID_LINES = PERFORMANCE.MAX_LARGE_GRID_LINES;
export const GRID_EXTENSION_FACTOR = CONVERSION.GRID_EXTENSION_FACTOR;
export const GRID_MAJOR_SPACING = GRID.MAJOR_SPACING;
export const MAX_GRID_CREATION_ATTEMPTS = GRID_CREATION.MAX_ATTEMPTS;
export const MIN_GRID_CREATION_INTERVAL = GRID_CREATION.MIN_INTERVAL;
