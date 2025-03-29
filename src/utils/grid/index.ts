
/**
 * Grid module index
 * Exports all grid-related utilities
 * @module grid
 */

// Export all grid creation functions
export * from "./gridCreation";
export * from "./gridManager";
export * from "./gridValidation";
export * from "./consoleThrottling";

// Grid constants
export const GRID_CREATION_CONSTANTS = {
  /**
   * Maximum time allowed for grid creation in ms
   * @constant {number}
   */
  MAX_CREATION_TIME: 500,
  
  /**
   * Timeout for grid creation in ms
   * @constant {number}
   */
  CREATION_TIMEOUT: 2000,
  
  /**
   * Maximum number of grid creation attempts
   * @constant {number}
   */
  MAX_ATTEMPTS: 3
};

// Constants for grid creation throttling
export const GRID_CREATION_COOLDOWN = 500;
export const MAX_CREATE_ATTEMPTS = 3;

// Toast message constants
export const TOAST_MESSAGES = {
  /**
   * Grid creation failed message
   * @constant {string}
   */
  GRID_CREATION_FAILED: "Grid creation failed. Please try again.",
  
  /**
   * Using fallback grid message
   * @constant {string}
   */
  USING_FALLBACK_GRID: "Using simplified grid due to performance constraints."
};

/**
 * Handle grid creation error
 * Common error handling for grid creation
 * 
 * @param {Error} error - The error that occurred
 * @param {(value: boolean) => void} setHasError - Function to set error state
 * @param {(value: string) => void} setErrorMessage - Function to set error message
 */
export function handleGridCreationError(
  error: Error,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
): void {
  console.error("Grid creation error:", error);
  
  // Set error state
  setHasError(true);
  setErrorMessage(`Grid creation error: ${error.message}`);
}

/**
 * Try to acquire grid creation lock with safety timeout
 * Prevents multiple grid creation attempts at the same time
 * 
 * @param {string} lockId - Unique identifier for the lock
 * @returns {boolean} Whether the lock was acquired
 */
export function acquireGridLockWithSafety(lockId: string): boolean {
  // Implementation of lock mechanism would go here
  // For simplicity, we'll just return true in this example
  return true;
}

/**
 * Clean up grid creation resources
 * Frees any resources used during grid creation
 */
export function cleanupGridResources(): void {
  // Implementation would go here
  // For example, clearing any timeouts or cached values
}
