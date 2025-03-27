
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
   * Pixels to leave as margin between grid and canvas edge
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

// For backward compatibility
export const EXTENSION_FACTOR = GRID_POSITIONING.EXTENSION_FACTOR;
export const EDGE_MARGIN = GRID_POSITIONING.EDGE_MARGIN;
export const MARKER_OFFSET = GRID_POSITIONING.MARKER_OFFSET;
export const MARKER_FONT_SIZE = GRID_POSITIONING.MARKER_FONT_SIZE;
