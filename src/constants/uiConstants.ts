/**
 * UI constants used throughout the application
 * Centralizes UI values to avoid magic strings and numbers
 * @module uiConstants
 */

import i18n from 'i18next';

/**
 * UI feedback messages
 * Standardized text for consistent user notifications
 * Note: These values are now pulled from i18n translations
 * @constant {Object}
 */
export const UI_MESSAGES = {
  /**
   * Line thickness updated message
   * Displayed when user changes the drawing line thickness
   * @constant {string}
   */
  LINE_THICKNESS_UPDATED: () => i18n.t('canvas.messages.lineThicknessUpdated'),
  
  /**
   * Color updated message
   * Displayed when user changes the drawing line color
   * @constant {string}
   */
  COLOR_UPDATED: () => i18n.t('canvas.messages.colorUpdated'),
  
  /**
   * Canvas drawing error message
   * Displayed when canvas fails to initialize
   * @constant {string}
   */
  CANVAS_ERROR: () => i18n.t('canvas.messages.canvasError'),
  
  /**
   * Success message for state save
   * Displayed when drawing state is successfully saved
   * @constant {string}
   */
  STATE_SAVED: () => i18n.t('canvas.messages.stateSaved'),
  
  /**
   * Message for successful undo
   * Displayed when undo operation completes
   * @constant {string}
   */
  UNDO_SUCCESS: () => i18n.t('canvas.messages.undoSuccess'),
  
  /**
   * Message for successful redo
   * Displayed when redo operation completes
   * @constant {string}
   */
  REDO_SUCCESS: () => i18n.t('canvas.messages.redoSuccess')
};

/**
 * UI animation durations
 * Timing values for consistent animations
 * @constant {Object}
 */
export const UI_TIMING = {
  /**
   * Standard toast duration in ms
   * How long notifications remain visible by default
   * @constant {number}
   */
  TOAST_DURATION: 3000,
  
  /**
   * Short animation duration in ms
   * For quick, subtle animations like button press feedback
   * @constant {number}
   */
  SHORT_ANIMATION: 200,
  
  /**
   * Medium animation duration in ms
   * For standard transitions like panel slides
   * @constant {number}
   */
  MEDIUM_ANIMATION: 300,
  
  /**
   * Long animation duration in ms
   * For more dramatic animations that need emphasis
   * @constant {number}
   */
  LONG_ANIMATION: 500
};

/**
 * UI spacings and sizes
 * Dimensional values for consistent element sizing
 * @constant {Object}
 */
export const UI_SIZES = {
  /**
   * Toolbar icon size in pixels
   * Standard size for icons in the main toolbar
   * @constant {number}
   */
  TOOLBAR_ICON_SIZE: 24,
  
  /**
   * Small icon size in pixels
   * For secondary or contextual icons
   * @constant {number}
   */
  SMALL_ICON_SIZE: 16,
  
  /**
   * Large icon size in pixels
   * For primary or emphasized icons
   * @constant {number}
   */
  LARGE_ICON_SIZE: 32,
  
  /**
   * Default button padding in pixels
   * Standard internal spacing for button elements
   * @constant {number}
   */
  BUTTON_PADDING: 8,
  
  /**
   * Default margin between UI elements in pixels
   * Standard spacing between adjacent UI components
   * @constant {number}
   */
  ELEMENT_MARGIN: 16
};
