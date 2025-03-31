
/**
 * Grid system constants
 * Used for consistent grid dimensions and styling across the application
 * @module constants/gridConstants
 */

/**
 * Grid measurement and styling constants
 */
export const GRID_CONSTANTS = {
  // Grid sizes
  SMALL_GRID_SIZE: 20,
  LARGE_GRID_SIZE: 100,
  
  // Grid colors for different hierarchy levels
  SMALL_GRID_COLOR: "#e0e0e0",
  LARGE_GRID_COLOR: "#c0c0c0",
  MAJOR_GRID_COLOR: "#a0a0a0",
  
  // Line widths for different grid types
  SMALL_GRID_WIDTH: 1,
  LARGE_GRID_WIDTH: 1.5,
  
  // Canvas size constraints
  MIN_CANVAS_WIDTH: 600,
  MIN_CANVAS_HEIGHT: 400,
  MAX_CANVAS_WIDTH: 4000,
  MAX_CANVAS_HEIGHT: 3000,
  
  // Grid visibility controls
  DEFAULT_SHOW_GRID: true,
  DEFAULT_SNAP_TO_GRID: true,
  
  // Marker settings for labels and measurements
  MARKER_TEXT_SIZE: 12,
  MARKER_BACKGROUND: "rgba(255, 255, 255, 0.7)",
  MARKER_PADDING: 4,
  MARKER_COLOR: "#333333",
  
  // Pixel-to-meter conversion
  PIXELS_PER_METER: 100,
  
  // For backward compatibility
  GRID_SIZE: 20,
  GRID_COLOR: "#e0e0e0",
};
