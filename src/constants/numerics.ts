
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
