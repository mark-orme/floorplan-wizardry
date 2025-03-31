
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
  SMALL_GRID_SIZE: 10, // Now 10px = 0.1m
  LARGE_GRID_SIZE: 100, // Now 100px = 1.0m
  
  // Grid colors for different hierarchy levels
  SMALL_GRID_COLOR: "#e0f7fa", // Lighter blue color similar to the reference
  LARGE_GRID_COLOR: "#80deea", // Slightly darker blue for larger grid
  MAJOR_GRID_COLOR: "#4dd0e1", // Even darker blue for major grid lines
  
  // Line widths for different grid types
  SMALL_GRID_WIDTH: 0.5, // Thinner lines for small grid
  LARGE_GRID_WIDTH: 1, // Medium width for large grid
  
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
  PIXELS_PER_METER: 100, // Now 100px = 1m (10 small squares of 10px each)
  
  // For backward compatibility
  GRID_SIZE: 10,
  GRID_COLOR: "#e0f7fa",
};
