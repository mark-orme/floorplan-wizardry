
/**
 * Grid constants
 * Contains all constants related to grid creation and management
 * @module grid/constants
 */

/**
 * Grid creation timing constants
 * @constant {Object}
 */
export const GRID_CREATION_CONSTANTS = {
  /**
   * Delay for logging in development mode (ms)
   * @constant {number}
   */
  DEV_LOG_DELAY: 100,
  
  /**
   * Maximum time allowed for grid creation in ms
   * @constant {number}
   */
  MAX_CREATION_TIME: 2000,
  
  /**
   * Delay between creation attempts in ms
   * @constant {number}
   */
  RETRY_DELAY: 500
};

/**
 * Toast message constants
 * @constant {Object}
 */
export const TOAST_MESSAGES = {
  /**
   * Error message for grid creation failure
   * @constant {string}
   */
  GRID_CREATION_FAILED: "Grid creation failed - no objects could be created",
  
  /**
   * Error message for all methods failing
   * @constant {string}
   */
  ALL_METHODS_FAILED: "All grid creation methods failed",
  
  /**
   * Successful grid creation message
   * @constant {string}
   */
  GRID_CREATED: "Grid created successfully",
  
  /**
   * Fallback grid creation message
   * @constant {string}
   */
  USING_FALLBACK_GRID: "Using fallback grid"
};

// Grid creation constants
export const GRID_CREATION_COOLDOWN = 5000; // 5 seconds between attempts
export const MAX_CREATE_ATTEMPTS = 5;
