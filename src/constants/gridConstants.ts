
/**
 * Grid Constants
 * Defines standard grid sizes and appearance
 * @module constants/gridConstants
 */

export const GRID_CONSTANTS = {
  /** Small grid size in pixels */
  SMALL_GRID_SIZE: 20,
  
  /** Large grid size in pixels */
  LARGE_GRID_SIZE: 100,
  
  /** Small grid line color */
  SMALL_GRID_COLOR: "#DDDDDD",
  
  /** Large grid line color */
  LARGE_GRID_COLOR: "#BBBBBB",
  
  /** Small grid line width */
  SMALL_GRID_WIDTH: 0.5,
  
  /** Large grid line width */
  LARGE_GRID_WIDTH: 1,
  
  /** Minimum canvas width for grid */
  MIN_CANVAS_WIDTH: 600,
  
  /** Minimum canvas height for grid */
  MIN_CANVAS_HEIGHT: 400,
  
  /** Grid creation attempts before giving up */
  MAX_ATTEMPTS: 5,
  
  /** Grid creation throttle time in ms */
  THROTTLE_TIME: 2000,
  
  /** Grid visibility check interval in ms */
  VISIBILITY_CHECK_INTERVAL: 3000,
  
  /** Pixels per meter for scale representation */
  PIXELS_PER_METER: 100,
  
  /** Marker text size in pixels */
  MARKER_TEXT_SIZE: 12,
  
  /** Marker text color */
  MARKER_COLOR: "#555555",
  
  /** Small grid spacing value (alias) */
  SMALL_GRID: 20,
  
  /** Large grid spacing value (alias) */
  LARGE_GRID: 100
};

/**
 * For backward compatibility
 */
export const PIXELS_PER_METER = GRID_CONSTANTS.PIXELS_PER_METER;
