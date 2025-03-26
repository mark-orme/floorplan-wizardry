
/**
 * Grid management constants
 * Constants for grid management functionality
 * @module grid-management/constants
 */

/**
 * Minimum time between grid creation attempts (ms)
 * @constant {number}
 */
export const MIN_ATTEMPT_INTERVAL = 1000;

/**
 * Maximum number of retry attempts
 * @constant {number}
 */
export const MAX_RETRY_ATTEMPTS = 5;

/**
 * Base delay for exponential backoff (ms)
 * @constant {number}
 */
export const BASE_RETRY_DELAY = 200;

/**
 * Maximum delay for retries (ms)
 * @constant {number}
 */
export const MAX_RETRY_DELAY = 2000;

/**
 * Initial retry delay (ms)
 * @constant {number}
 */
export const INITIAL_RETRY_DELAY = 100;

/**
 * Periodic check interval (ms)
 * @constant {number}
 */
export const PERIODIC_CHECK_INTERVAL = 1000;
