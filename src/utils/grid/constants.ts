
/**
 * Grid constants module
 * Contains common constants for grid creation and management
 * @module grid/constants
 */

/**
 * Toast messages for grid-related notifications
 */
export const TOAST_MESSAGES = {
  GRID_CREATION_FAILED: "Grid creation failed. Please try refreshing the page.",
  GRID_CREATION_SUCCESS: "Grid created successfully.",
  USING_FALLBACK_GRID: "Using simplified grid mode.",
  GRID_RECREATED: "Grid has been recreated.",
  GRID_ERROR: "Error creating drawing grid."
};

/**
 * Grid creation constants for throttling and retries
 */
export const GRID_CREATION_CONSTANTS = {
  /**
   * Cooldown period between grid creation attempts in milliseconds
   * Prevents excessive recreation
   */
  COOLDOWN: 1000,
  
  /**
   * Maximum number of creation attempts before giving up
   */
  MAX_ATTEMPTS: 3,
  
  /**
   * Maximum time in milliseconds that grid creation should take
   * Used for performance monitoring
   */
  MAX_CREATION_TIME: 500,
  
  /**
   * Default small grid spacing in pixels
   */
  SMALL_GRID_SPACING: 10,
  
  /**
   * Default large grid spacing in pixels
   */
  LARGE_GRID_SPACING: 50,
  
  /**
   * Maximum number of grid lines before performance optimization kicks in
   */
  MAX_GRID_LINES: 200
};

/**
 * Grid error codes for consistent error identification
 */
export const GRID_ERROR_CODES = {
  INVALID_CANVAS: "GRID_ERR_001",
  CREATION_IN_PROGRESS: "GRID_ERR_002",
  THROTTLED: "GRID_ERR_003",
  MAX_ATTEMPTS: "GRID_ERR_004",
  CREATION_FAILED: "GRID_ERR_005",
  NO_OBJECTS_CREATED: "GRID_ERR_006",
  EMERGENCY_FAILED: "GRID_ERR_007",
  GRID_MISSING: "GRID_ERR_008"
};

/**
 * Grid debug constants
 */
export const GRID_DEBUG = {
  /**
   * Whether to enable detailed grid debug logging
   */
  ENABLED: process.env.NODE_ENV === 'development',
  
  /**
   * Whether to send debug data to Sentry
   */
  SEND_TO_SENTRY: true,
  
  /**
   * Whether to show debug toasts
   */
  SHOW_TOASTS: process.env.NODE_ENV === 'development'
};

/**
 * Cooldown period between grid creation attempts in milliseconds
 * Direct export for backward compatibility
 */
export const GRID_CREATION_COOLDOWN = GRID_CREATION_CONSTANTS.COOLDOWN;

/**
 * Maximum number of creation attempts before giving up
 * Direct export for backward compatibility
 */
export const MAX_CREATE_ATTEMPTS = GRID_CREATION_CONSTANTS.MAX_ATTEMPTS;
