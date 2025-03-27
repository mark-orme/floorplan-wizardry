
/**
 * Color constants used throughout the application
 * Centralizes color values to avoid magic colors and maintain consistent theming
 * @module colorConstants
 */

/**
 * Default drawing line colors
 * Core palette for drawing operations
 * @constant {Object}
 */
export const LINE_COLORS = {
  /**
   * Default drawing color (black)
   * Standard color for new drawing operations
   * @constant {string}
   */
  DEFAULT: "#000000",
  
  /**
   * Red line color
   * Used for error indicators and highlighting
   * @constant {string}
   */
  RED: "#FF0000",
  
  /**
   * Blue line color
   * Used for selection indicators and system elements
   * @constant {string}
   */
  BLUE: "#0000FF",
  
  /**
   * Green line color
   * Used for success indicators and special elements
   * @constant {string}
   */
  GREEN: "#00FF00"
};

/**
 * Grid color constants
 * Colors used specifically for grid rendering
 * @constant {Object}
 */
export const GRID_COLORS = {
  /**
   * Small grid line color
   * Lighter blue for minor grid lines (0.1m spacing)
   * @constant {string}
   */
  SMALL_GRID: "#A0C5E0",
  
  /**
   * Large grid line color
   * Darker blue for major grid lines (1m spacing)
   * @constant {string}
   */
  LARGE_GRID: "#4090CC", 
  
  /**
   * Grid text color
   * Dark gray for grid measurements and labels
   * @constant {string}
   */
  TEXT: "#555555"
};

/**
 * UI element color constants
 * Semantic colors for user interface elements
 * @constant {Object}
 */
export const UI_COLORS = {
  /**
   * Success color
   * Green shade for positive outcomes and confirmations
   * @constant {string}
   */
  SUCCESS: "#10B981",
  
  /**
   * Error color
   * Red shade for errors and destructive actions
   * @constant {string}
   */
  ERROR: "#EF4444",
  
  /**
   * Warning color
   * Amber shade for warnings and cautions
   * @constant {string}
   */
  WARNING: "#F59E0B",
  
  /**
   * Info color
   * Blue shade for informational elements
   * @constant {string}
   */
  INFO: "#3B82F6"
};
