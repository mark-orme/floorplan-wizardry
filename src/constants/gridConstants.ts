
/**
 * Grid Constants
 * Defines constants used for grid rendering and behavior
 */

export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  GRID_SIZE: 50,
  
  // Grid colors
  SMALL_GRID_COLOR: '#f0f0f0',
  LARGE_GRID_COLOR: '#e0e0e0',
  
  // Grid line widths
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  
  // Grid appearance
  DEFAULT_VISIBLE: true,
  DEFAULT_GRID_SIZE: 50,
  DEFAULT_GRID_COLOR: '#e0e0e0',
  DEFAULT_GRID_OPACITY: 0.5,
  
  // Grid interactions
  ENABLE_SNAPPING: true,
  SNAP_THRESHOLD: 10,
  SNAP_DISTANCE: 5,
  
  // Grid performance
  CANVAS_MARGIN: 100,
  RENDER_VISIBLE_ONLY: true,
  MAX_GRID_LINES: 1000,
  GRID_BATCH_SIZE: 100,
  GRID_RENDER_DELAY: 50,
  
  // Grid debugging
  SHOW_GRID_DEBUG: false,
  SHOW_GRID_BOUNDARIES: false,
  SHOW_GRID_STATS: false,
  SHOW_GRID_SNAPLINES: false,
  
  // Grid reliability
  CHECK_INTERVAL: 5000,
  MAX_CHECK_COUNT: 10,
  GRID_RECREATION_DELAY: 500
};

export default GRID_CONSTANTS;
