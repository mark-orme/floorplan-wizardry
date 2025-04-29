
/**
 * Grid-related constants
 */

// Grid sizes
export const SMALL_GRID_SIZE = 10;
export const LARGE_GRID_SIZE = 50;

// Grid colors
export const SMALL_GRID_COLOR = '#e0e0e0';
export const LARGE_GRID_COLOR = '#c0c0c0';

// Line widths
export const SMALL_GRID_WIDTH = 0.2;
export const LARGE_GRID_WIDTH = 0.5;

// Snapping
export const SNAP_THRESHOLD = 5;
export const ANGLE_SNAP_THRESHOLD = 5;

// Visibility settings
export const DEFAULT_GRID_VISIBLE = true;
export const DEFAULT_SNAP_ENABLED = true;

// Unified grid constants object
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE,
  LARGE_GRID_SIZE,
  SMALL_GRID_COLOR,
  LARGE_GRID_COLOR,
  SNAP_THRESHOLD,
  ANGLE_SNAP_THRESHOLD,
  SMALL_GRID_WIDTH,
  LARGE_GRID_WIDTH,
  DEFAULT_GRID_VISIBLE,
  DEFAULT_SNAP_ENABLED
};

// Export default grid properties
export const DEFAULT_GRID_PROPS = {
  size: SMALL_GRID_SIZE,
  visible: DEFAULT_GRID_VISIBLE,
  snapEnabled: DEFAULT_SNAP_ENABLED,
  snapThreshold: SNAP_THRESHOLD
};
