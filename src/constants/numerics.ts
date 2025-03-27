
/**
 * Numeric constants used throughout the application
 * @module constants/numerics
 */

/**
 * Grid spacing constants
 */
export const GRID_SPACING = {
  /** Small grid spacing in pixels */
  SMALL: 10,
  
  /** Large grid spacing in pixels */
  LARGE: 50
};

/**
 * Grid line configuration
 */
export const GRID_LINE_CONFIG = {
  /** Grid line color */
  COLOR: '#cccccc',
  
  /** Grid line width */
  WIDTH: 1
};

/**
 * Pixels per meter for scale conversion
 */
export const PIXELS_PER_METER = 40;

/**
 * Default line thickness for drawing
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Initial zoom level
 */
export const INITIAL_ZOOM = 1.0;

/**
 * Zoom step for zoom in/out operations
 */
export const ZOOM_STEP = 0.1;

/**
 * Min/max zoom constraints
 */
export const ZOOM_CONSTRAINTS = {
  /** Minimum zoom level */
  MIN: 0.2,
  
  /** Maximum zoom level */
  MAX: 5.0
};

/**
 * Zoom multipliers for in/out operations
 */
export const ZOOM_MULTIPLIERS = {
  /** Multiplier for zooming in */
  IN: 1.2,
  
  /** Multiplier for zooming out */
  OUT: 0.8
};

/**
 * Distance threshold for snap functionality (in pixels)
 */
export const SNAP_THRESHOLD = 10;

/**
 * Default snap angle increment (in degrees)
 */
export const DEFAULT_ANGLE_INCREMENT = 45;

/**
 * Threshold for angle snapping (in degrees)
 */
export const ANGLE_SNAP_THRESHOLD = 5;

/**
 * Tolerance for floating point comparisons
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;

/**
 * Minimum line length (in pixels)
 */
export const MIN_LINE_LENGTH = 5;

/**
 * Minimum shape area (in square pixels)
 */
export const MIN_SHAPE_AREA = 25;

/**
 * Threshold for determining if points are close (in pixels)
 */
export const CLOSE_POINT_THRESHOLD = 5;

/**
 * Threshold for closing shapes (in pixels)
 */
export const SHAPE_CLOSE_THRESHOLD = 10;

/**
 * Grid line widths
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;
export const LARGE_GRID_LINE_WIDTH = 1;

/**
 * Precision for area calculations
 */
export const AREA_PRECISION = 2;

/**
 * Precision for distance measurements
 */
export const DISTANCE_PRECISION = 2;

/**
 * Maximum history states for undo/redo
 */
export const MAX_HISTORY_STATES = 50;

/**
 * Maximum objects per canvas (for performance)
 */
export const MAX_OBJECTS_PER_CANVAS = 1000;

/**
 * Grid constants for layer ordering
 */
export const SMALL_GRID = 'small-grid';
export const LARGE_GRID = 'large-grid';

/**
 * Default canvas dimensions
 */
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Grid extension beyond canvas borders (multiplier)
 */
export const GRID_EXTENSION_FACTOR = 2;

/**
 * Maximum grid lines (for performance)
 */
export const MAX_SMALL_GRID_LINES = 500;
export const MAX_LARGE_GRID_LINES = 100;

/**
 * Derived spacing constants for backward compatibility
 */
export const SMALL_GRID_SPACING = GRID_SPACING.SMALL;
export const LARGE_GRID_SPACING = GRID_SPACING.LARGE;

/**
 * Constants for zoom level 
 */
export const ZOOM_LEVEL_CONSTANTS = ZOOM_CONSTRAINTS;
