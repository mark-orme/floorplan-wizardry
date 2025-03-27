
/**
 * Grid positioning constants
 * Defines constants for grid positioning and layout
 * @module grid/gridPositioningConstants
 */

/**
 * Grid offset factor for extending grid beyond canvas edges
 */
export const GRID_OFFSET_FACTOR = 1.5;

/**
 * Grid positioning constants
 * Values for determining grid placement and alignment
 */
export const GRID_POSITIONING = {
  /**
   * Extension factor for grid
   * Multiplier for how far grid extends beyond canvas edges
   * @constant {number}
   */
  EXTENSION_FACTOR: 1.5,
  
  /**
   * Margin for grid from canvas edge
   * Pixels to leave as margin between canvas edge
   * @constant {number}
   */
  EDGE_MARGIN: 20,
  
  /**
   * Marker offset from canvas edge
   * Pixels to offset markers from canvas edge
   * @constant {number}
   */
  MARKER_OFFSET: 5,
  
  /**
   * Marker font size
   * Font size in pixels for grid markers
   * @constant {number}
   */
  MARKER_FONT_SIZE: 10
};

/**
 * Path processing constants
 * Controls how drawing paths are processed
 */
export const PATH_PROCESSING = {
  /**
   * Minimum distance for a valid path in pixels
   * Drawing paths shorter than this are ignored
   * @constant {number}
   */
  MIN_PATH_DISTANCE: 5,
  
  /**
   * Maximum angle variation for auto-straightening in degrees
   * Lines within this threshold are straightened automatically
   * @constant {number}
   */
  STRAIGHTEN_ANGLE_THRESHOLD: 10,
  
  /**
   * Extension factor for walls
   * Amount to extend wall endpoints for better connections
   * @constant {number}
   */
  WALL_EXTENSION_FACTOR: 0.05,
  
  /**
   * Minimum number of points to keep in a full path
   * Ensures paths have enough detail after simplification
   * @constant {number}
   */
  MIN_POINTS_THRESHOLD: 10,
  
  /**
   * Divisor for sampling when reducing path point count
   * Controls how aggressively points are removed during simplification
   * @constant {number}
   */
  SAMPLING_DIVISOR: 8
};

// For backward compatibility
export const EXTENSION_FACTOR = GRID_POSITIONING.EXTENSION_FACTOR;
export const EDGE_MARGIN = GRID_POSITIONING.EDGE_MARGIN;
export const MARKER_OFFSET = GRID_POSITIONING.MARKER_OFFSET;
export const MARKER_FONT_SIZE = GRID_POSITIONING.MARKER_FONT_SIZE;
