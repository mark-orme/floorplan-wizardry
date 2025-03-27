
/**
 * Grid positioning constants
 * Defines constants used for grid placement and alignment
 * @module grid/gridPositioningConstants
 */

/**
 * Grid offset factor - determines how far the grid extends beyond canvas edges
 * 0.25 means grid starts at -25% of canvas width/height
 * @constant {number}
 */
export const GRID_OFFSET_FACTOR = 0.25;

/**
 * Grid snapping tolerance in pixels
 * How close a point must be to a grid line to snap to it
 * @constant {number}
 */
export const GRID_SNAP_TOLERANCE = 5;

/**
 * Large grid snap priority factor
 * Increases the snapping priority for large grid lines
 * @constant {number}
 */
export const LARGE_GRID_PRIORITY = 2;
