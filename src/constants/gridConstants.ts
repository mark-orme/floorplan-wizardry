
/**
 * Grid constants
 */
export const GRID_CONSTANTS = {
  // Grid sizing
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 100,
  
  // Grid styling
  SMALL_GRID_COLOR: '#AAAAAA', // Darker gray for better visibility
  LARGE_GRID_COLOR: '#777777', // Even darker gray for large grid
  SMALL_GRID_WIDTH: 0.8, // Slightly thicker for better visibility
  LARGE_GRID_WIDTH: 1.5, // Thicker width for large grid
  
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
  GRID_CHECK_INTERVAL: 2000, // Check grid every 2 seconds (faster checks)
  MIN_GRID_OBJECTS: 20, // Minimum number of grid objects that should exist
  AUTO_RECREATE_ON_EMPTY: true, // Automatically recreate grid if missing
  
  // New safeguard settings
  GRID_VISIBILITY_CHECK_INTERVAL: 5000, // Check grid visibility every 5 seconds
  GRID_RECREATION_ATTEMPTS: 3, // Number of attempts to recreate grid if missing
  GRID_RECREATION_DELAY: 1000, // Delay between grid recreation attempts
  GRID_AUTO_FIX: true // Automatically fix grid issues
};
