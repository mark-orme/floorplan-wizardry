
import { Object as FabricObject } from "fabric";

// Grid creation state
let gridCreationInProgress = false;
let gridCreationStartTime = 0;
let gridCreationErrorCount = 0;
let gridInstances: Record<string, FabricObject[]> = {};

/**
 * Reset grid progress tracking
 */
export const resetGridProgress = (): void => {
  gridCreationInProgress = false;
  gridCreationStartTime = 0;
  gridCreationErrorCount = 0;
};

/**
 * Start grid creation process
 * @returns {boolean} Whether creation can start
 */
export const startGridCreation = (): boolean => {
  if (gridCreationInProgress) {
    return false;
  }
  
  gridCreationInProgress = true;
  gridCreationStartTime = Date.now();
  return true;
};

/**
 * Finish grid creation process
 * @param {string} instanceId - Identifier for the grid instance
 * @param {FabricObject[]} gridObjects - Created grid objects
 */
export const finishGridCreation = (instanceId: string, gridObjects: FabricObject[]): void => {
  gridCreationInProgress = false;
  gridInstances[instanceId] = gridObjects;
};

/**
 * Handle grid creation error
 * @param {Error} error - The error that occurred
 */
export const handleGridCreationError = (error: Error): void => {
  gridCreationInProgress = false;
  gridCreationErrorCount++;
  
  console.error("Grid creation error:", error);
};

/**
 * Check if grid creation should be throttled
 * @returns {boolean} Whether to throttle creation
 */
export const shouldThrottleCreation = (): boolean => {
  const now = Date.now();
  
  // Throttle if creation in progress
  if (gridCreationInProgress) {
    // Check for stuck creation process (timeout after 5 seconds)
    if (now - gridCreationStartTime > 5000) {
      console.warn("Grid creation appears stuck, resetting");
      resetGridProgress();
      return false;
    }
    return true;
  }
  
  // Throttle frequent creation attempts (less than 500ms apart)
  if (gridCreationStartTime > 0 && now - gridCreationStartTime < 500) {
    return true;
  }
  
  return false;
};

/**
 * Log grid creation status
 * @param {string} message - Status message
 * @param {any} data - Additional data
 */
export const logGridStatus = (message: string, data?: any): void => {
  console.log(`[Grid] ${message}`, data || '');
};
