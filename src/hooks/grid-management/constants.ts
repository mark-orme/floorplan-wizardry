
/**
 * Grid management constants
 * Defines timing and limit values for grid creation operations
 * @module grid-management/constants
 */

/**
 * Timing constants for grid creation
 */
export const GRID_TIMING = {
  /**
   * Minimum interval between grid creation attempts in milliseconds
   * Prevents excessive grid creation operations that could impact performance
   * @constant {number}
   */
  MIN_ATTEMPT_INTERVAL: 300,
  
  /**
   * Default delay between grid creation attempts in milliseconds
   * Provides a brief pause before retrying to allow system resources to recover
   * @constant {number}
   */
  DEFAULT_ATTEMPT_DELAY: 100
};

/**
 * Limit constants for grid creation
 */
export const GRID_LIMITS = {
  /**
   * Maximum number of grid creation attempts
   * Prevents infinite retry loops if grid creation consistently fails
   * @constant {number}
   */
  MAX_ATTEMPTS: 5
};

// For backward compatibility
export const MIN_ATTEMPT_INTERVAL = GRID_TIMING.MIN_ATTEMPT_INTERVAL;
export const MAX_ATTEMPTS = GRID_LIMITS.MAX_ATTEMPTS;
export const DEFAULT_ATTEMPT_DELAY = GRID_TIMING.DEFAULT_ATTEMPT_DELAY;
