
/**
 * Grid and measurement constants
 */
export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  GRID_SIZE: 20, // Default grid size for snapping
  
  // Grid appearance
  SMALL_GRID_COLOR: '#EEEEEE',
  LARGE_GRID_COLOR: '#DDDDDD',
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  
  // Grid configuration
  DEFAULT_VISIBLE: true,
  GRID_Z_INDEX: 1,
  
  // Grid snap settings
  SNAP_THRESHOLD: 10,
  SNAP_TO_GRID: true,
  SNAP_ANGLE: 15, // Snap angles in degrees
  
  // Measurement settings
  PIXELS_PER_METER: 50, // Scale factor for converting pixels to meters
  SHOW_MEASUREMENTS: true,
  MEASURE_UNIT: 'm', // Meters
  MEASURE_PRECISION: 2,
  
  // Grid behavior
  GRID_AUTO_RESIZE: true,
  GRID_MAX_ZOOM: 3,
  GRID_MIN_ZOOM: 0.5,
  GRID_AUTO_FIX: true,
  
  // Additional grid constants needed for stability
  MIN_GRID_OBJECTS: 10,
  AUTO_RECREATE_ON_EMPTY: true,
  GRID_CHECK_INTERVAL: 10000, // 10 seconds
  GRID_RECREATION_ATTEMPTS: 3,
  GRID_RECREATION_DELAY: 1000 // 1 second
};
