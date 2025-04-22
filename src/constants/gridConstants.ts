
/**
 * Grid constants for canvas
 */

export const SMALL_GRID_SIZE = 10;
export const LARGE_GRID_SIZE = 50;
export const GRID_SIZE = 25;

export const SMALL_GRID_COLOR = '#e0e0e0';
export const LARGE_GRID_COLOR = '#c0c0c0';

export const SMALL_GRID_WIDTH = 0.5;
export const LARGE_GRID_WIDTH = 1;

export const DEFAULT_VISIBLE = true;
export const DEFAULT_SNAP_TO_GRID = true;
export const DEFAULT_GRID_OPACITY = 0.6;

export const PIXELS_PER_METER = 50;
export const GRID_UNIT_SIZE = 10;
export const GRID_UNIT_LABEL = 'cm';

export const GRID_MAX_ZOOM = 5;
export const GRID_MIN_ZOOM = 0.2;

export const GRID_RENDER_DELAY = 500;
export const GRID_DEBOUNCE_TIME = 100;
export const GRID_AUTO_FIX = true;
export const GRID_LABEL_FONT = '12px Arial';
export const GRID_LABEL_COLOR = '#606060';

export const SHOW_GRID_LABELS = true;
export const SHOW_GRID_AXES = true;

export const GRID_BORDER_COLOR = '#e0e0e0';
export const GRID_BACKGROUND_COLOR = '#ffffff';

export const GRID_ZOOM_SENSITIVITY = 0.1;
export const GRID_PAN_SENSITIVITY = 1;

export const GRID_RECREATION_DELAY = 250;

// Export a GRID_CONSTANTS object for compatibility with components expecting it
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE,
  LARGE_GRID_SIZE,
  GRID_SIZE,
  SMALL_GRID_COLOR,
  LARGE_GRID_COLOR,
  SMALL_GRID_WIDTH,
  LARGE_GRID_WIDTH,
  DEFAULT_VISIBLE,
  DEFAULT_SNAP_TO_GRID,
  DEFAULT_GRID_OPACITY,
  PIXELS_PER_METER,
  GRID_UNIT_SIZE,
  GRID_UNIT_LABEL,
  GRID_MAX_ZOOM,
  GRID_MIN_ZOOM,
  GRID_RENDER_DELAY,
  GRID_DEBOUNCE_TIME,
  GRID_AUTO_FIX,
  GRID_LABEL_FONT,
  GRID_LABEL_COLOR,
  SHOW_GRID_LABELS,
  SHOW_GRID_AXES,
  GRID_BORDER_COLOR,
  GRID_BACKGROUND_COLOR,
  GRID_ZOOM_SENSITIVITY,
  GRID_PAN_SENSITIVITY,
  GRID_RECREATION_DELAY
};
