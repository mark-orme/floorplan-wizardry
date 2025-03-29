
/**
 * Grid constants
 * Configuration values for grid creation and rendering
 * @module constants/gridConstants
 */

export const GRID_CONSTANTS = {
  // Grid spacing in pixels
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  
  // Direct values for grid creation
  SMALL_GRID: 10, // Added for direct reference
  LARGE_GRID: 50, // Added for direct reference
  
  // Pixels per meter for scaling
  PIXELS_PER_METER: 100,
  
  // Grid line colors
  SMALL_GRID_COLOR: "#f0f0f0",
  LARGE_GRID_COLOR: "#d0d0d0",
  MARKER_COLOR: "#a0a0a0",
  
  // Grid line widths
  SMALL_GRID_WIDTH: 0.5,
  LARGE_GRID_WIDTH: 1,
  
  // Grid drawing settings
  GRID_OPACITY: 0.8,
  GRID_SNAP_THRESHOLD: 5,
  GRID_SNAP_STRENGTH: 1,
  BACKGROUND_OPACITY: 0.05,
  
  // Grid marker settings
  MARKER_TEXT_SIZE: 10
};

export const GRID_CREATION_CONSTANTS = {
  // Maximum time in ms that grid creation should take
  MAX_CREATION_TIME: 300,
  
  // Minimum time between grid recreation attempts
  MIN_RECREATION_INTERVAL: 2000,
  
  // Maximum number of retries for grid creation
  MAX_RETRIES: 3
};

export const TOAST_MESSAGES = {
  GRID_CREATION_FAILED: "Failed to create drawing grid",
  USING_FALLBACK_GRID: "Using simplified grid",
  GRID_RECREATED: "Grid recreated successfully"
};

// ESLint validation object to ensure all constants are properly used
export const GRID_CONSTANTS_VALIDATION = {
  // This object serves as a typing reference for ESLint to check properties
  // It must match the structure of GRID_CONSTANTS
  SMALL_GRID_SIZE: true,
  LARGE_GRID_SIZE: true,
  SMALL_GRID: true,
  LARGE_GRID: true,
  PIXELS_PER_METER: true,
  SMALL_GRID_COLOR: true,
  LARGE_GRID_COLOR: true,
  MARKER_COLOR: true,
  SMALL_GRID_WIDTH: true,
  LARGE_GRID_WIDTH: true,
  GRID_OPACITY: true,
  GRID_SNAP_THRESHOLD: true,
  GRID_SNAP_STRENGTH: true,
  BACKGROUND_OPACITY: true,
  MARKER_TEXT_SIZE: true
};
