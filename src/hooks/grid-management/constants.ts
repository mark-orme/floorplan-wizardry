
/**
 * Grid management constants
 * Defines timing and limit values for grid creation operations
 * @module grid-management/constants
 */

/**
 * Minimum interval between grid creation attempts in milliseconds
 * Prevents excessive grid creation operations that could impact performance
 * @constant {number}
 */
export const MIN_ATTEMPT_INTERVAL = 300;

/**
 * Maximum number of grid creation attempts
 * Prevents infinite retry loops if grid creation consistently fails
 * @constant {number}
 */
export const MAX_ATTEMPTS = 5;

/**
 * Default delay between grid creation attempts in milliseconds
 * Provides a brief pause before retrying to allow system resources to recover
 * @constant {number}
 */
export const DEFAULT_ATTEMPT_DELAY = 100;
