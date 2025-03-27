
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
 * Distance threshold for snap functionality (in pixels)
 */
export const SNAP_THRESHOLD = 10;

/**
 * Default snap angle increment (in degrees)
 */
export const DEFAULT_ANGLE_INCREMENT = 45;
