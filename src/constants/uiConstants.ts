
/**
 * UI constants used throughout the application
 * Centralizes UI values to avoid magic strings and numbers
 * @module uiConstants
 */

/**
 * UI feedback messages
 * @constant {Object}
 */
export const UI_MESSAGES = {
  /**
   * Line thickness updated message
   * @constant {string}
   */
  LINE_THICKNESS_UPDATED: "Line thickness set to",
  
  /**
   * Color updated message
   * @constant {string}
   */
  COLOR_UPDATED: "Line color updated",
  
  /**
   * Canvas drawing error message
   * @constant {string}
   */
  CANVAS_ERROR: "Error initializing drawing canvas",
  
  /**
   * Success message for state save
   * @constant {string}
   */
  STATE_SAVED: "Drawing state saved",
  
  /**
   * Message for successful undo
   * @constant {string}
   */
  UNDO_SUCCESS: "Undo successful",
  
  /**
   * Message for successful redo
   * @constant {string}
   */
  REDO_SUCCESS: "Redo successful"
};

/**
 * UI animation durations
 * @constant {Object}
 */
export const UI_TIMING = {
  /**
   * Standard toast duration in ms
   * @constant {number}
   */
  TOAST_DURATION: 3000,
  
  /**
   * Short animation duration in ms
   * @constant {number}
   */
  SHORT_ANIMATION: 200,
  
  /**
   * Medium animation duration in ms
   * @constant {number}
   */
  MEDIUM_ANIMATION: 300,
  
  /**
   * Long animation duration in ms
   * @constant {number}
   */
  LONG_ANIMATION: 500
};

/**
 * UI spacings and sizes
 * @constant {Object}
 */
export const UI_SIZES = {
  /**
   * Toolbar icon size in pixels
   * @constant {number}
   */
  TOOLBAR_ICON_SIZE: 24,
  
  /**
   * Small icon size in pixels
   * @constant {number}
   */
  SMALL_ICON_SIZE: 16,
  
  /**
   * Large icon size in pixels
   * @constant {number}
   */
  LARGE_ICON_SIZE: 32,
  
  /**
   * Default button padding in pixels
   * @constant {number}
   */
  BUTTON_PADDING: 8,
  
  /**
   * Default margin between UI elements in pixels
   * @constant {number}
   */
  ELEMENT_MARGIN: 16
};
