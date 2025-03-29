/**
 * Grid manager for handling grid state and operations
 * Provides utilities for grid creation and management
 * @module grid/gridManager
 */

/**
 * Constants for grid creation
 */
const GRID_MANAGER_CONSTANTS = {
  /**
   * Minimum time between grid creation attempts in ms
   * @constant {number}
   */
  THROTTLE_TIME: 500,
  
  /**
   * Maximum number of grid status log entries
   * @constant {number}
   */
  MAX_STATUS_LOGS: 10
};

// Track grid creation state
let lastCreationAttempt = 0;
let gridCreationCount = 0;
const gridStatusLogs: Array<{timestamp: number; status: string}> = [];

/**
 * Check if grid creation should be throttled
 * Prevents too many grid creation attempts in quick succession
 * 
 * @returns {boolean} Whether grid creation should be throttled
 */
export function shouldThrottleCreation(): boolean {
  const now = Date.now();
  const timeSinceLastAttempt = now - lastCreationAttempt;
  
  // Update last attempt time
  lastCreationAttempt = now;
  
  // Increment creation count
  gridCreationCount++;
  
  // Add status log
  addGridStatusLog(`Grid creation attempt ${gridCreationCount}`);
  
  return timeSinceLastAttempt < GRID_MANAGER_CONSTANTS.THROTTLE_TIME;
}

/**
 * Add a grid status log entry
 * Keeps track of grid creation status for debugging
 * 
 * @param {string} status - Status message to log
 */
export function addGridStatusLog(status: string): void {
  // Add new log entry
  gridStatusLogs.push({
    timestamp: Date.now(),
    status
  });
  
  // Keep only the most recent logs
  if (gridStatusLogs.length > GRID_MANAGER_CONSTANTS.MAX_STATUS_LOGS) {
    gridStatusLogs.shift();
  }
}

/**
 * Get grid creation status logs
 * 
 * @returns {Array<{timestamp: number; status: string}>} Grid status logs
 */
export function getGridStatusLogs(): Array<{timestamp: number; status: string}> {
  return [...gridStatusLogs];
}

/**
 * Get current grid creation count
 * 
 * @returns {number} Number of grid creation attempts
 */
export function getGridCreationCount(): number {
  return gridCreationCount;
}

/**
 * Log current grid status
 * 
 * @param {string} message - Optional message to include in log
 */
export function logGridStatus(message?: string): void {
  console.log(`Grid Status${message ? `: ${message}` : ''}`, {
    creationCount: gridCreationCount,
    lastAttempt: new Date(lastCreationAttempt).toISOString(),
    statusLogs: gridStatusLogs
  });
}

/**
 * Reset grid creation state
 * Used when recreating grid from scratch
 */
export function resetGridCreationState(): void {
  lastCreationAttempt = 0;
  gridCreationCount = 0;
  gridStatusLogs.length = 0;
  addGridStatusLog("Grid creation state reset");
}
