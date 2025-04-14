
/**
 * Grid constants
 */
export const GRID_CONSTANTS = {
  // Grid sizing
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 100,
  
  // Grid styling
  SMALL_GRID_COLOR: '#BBBBBB', // Even darker gray for better visibility
  LARGE_GRID_COLOR: '#888888', // Even darker gray for large grid
  SMALL_GRID_WIDTH: 0.7, // Slightly thicker for better visibility
  LARGE_GRID_WIDTH: 1.2, // Thicker width for large grid
  
  // Grid visibility
  DEFAULT_VISIBLE: true,
  
  // Grid positioning
  GRID_Z_INDEX: -1,
  
  // Scaling
  SCALE_FACTOR: 1,
  
  // Canvas minimums
  MIN_CANVAS_WIDTH: 100,
  MIN_CANVAS_HEIGHT: 100,
  
  // Conversions
  PIXELS_PER_METER: 100,
  
  // Markers
  MARKER_TEXT_SIZE: 10,
  MARKER_COLOR: '#8E9196',
  
  // Dev safeguards
  GRID_CHECK_INTERVAL: 3000, // Check grid every 3 seconds
  MIN_GRID_OBJECTS: 20, // Minimum number of grid objects that should exist
  AUTO_RECREATE_ON_EMPTY: true // Automatically recreate grid if missing
};
