/**
 * Grid Manager
 * Centralized grid management and tracking across components
 * @module utils/gridManager
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { captureError } from "./sentryUtils";
import logger from "./logger";

interface GridProgressState {
  inProgress: boolean;
  lastAttemptTime: number;
  attemptsCount: number;
  lastError: Error | null;
}

// Singleton state for grid creation progress
const gridProgress: GridProgressState = {
  inProgress: false,
  lastAttemptTime: 0,
  attemptsCount: 0,
  lastError: null
};

// Track grid instances
const gridInstances: Map<string, FabricObject[]> = new Map();
const MAX_ATTEMPTS = 3;
const MIN_RETRY_INTERVAL = 2000; // ms

/**
 * Reset grid progress state
 * Used to break potential deadlocks in grid creation
 */
export const resetGridProgress = (): void => {
  console.log("Resetting grid progress state");
  gridProgress.inProgress = false;
  // We keep the attempts count to limit retries
};

/**
 * Check if grid creation should be rate-limited
 * @returns {boolean} Whether grid creation should be throttled
 */
export const shouldThrottleGridCreation = (): boolean => {
  const now = Date.now();
  return (now - gridProgress.lastAttemptTime) < MIN_RETRY_INTERVAL;
};

/**
 * Mark grid creation as in progress
 * @returns {boolean} Whether the operation can proceed
 */
export const startGridCreation = (): boolean => {
  if (gridProgress.inProgress) {
    logger.warn("Grid creation already in progress, skipping new request");
    return false;
  }
  
  if (gridProgress.attemptsCount >= MAX_ATTEMPTS) {
    logger.warn(`Max grid creation attempts (${MAX_ATTEMPTS}) reached`);
    return false;
  }
  
  if (shouldThrottleGridCreation()) {
    logger.warn("Grid creation throttled due to recent attempt");
    return false;
  }
  
  // Update state
  gridProgress.inProgress = true;
  gridProgress.attemptsCount++;
  gridProgress.lastAttemptTime = Date.now();
  logger.info(`Starting grid creation, attempt ${gridProgress.attemptsCount}`);
  
  return true;
};

/**
 * Mark grid creation as complete
 * @param {string} instanceId - Identifier for the grid instance
 * @param {FabricObject[]} gridObjects - Created grid objects
 */
export const finishGridCreation = (
  instanceId: string,
  gridObjects: FabricObject[]
): void => {
  // Reset progress
  gridProgress.inProgress = false;
  
  // Store instance
  if (gridObjects.length > 0) {
    gridInstances.set(instanceId, gridObjects);
    logger.info(`Grid creation for "${instanceId}" completed with ${gridObjects.length} objects`);
  } else {
    logger.warn(`Grid creation for "${instanceId}" completed but no objects were created`);
  }
};

/**
 * Handle grid creation error
 * @param {Error} error - The error that occurred
 */
export const handleGridCreationError = (error: Error): void => {
  // Reset progress
  gridProgress.inProgress = false;
  gridProgress.lastError = error;
  
  // Log error
  logger.error("Grid creation error:", error);
  
  // Report to Sentry with detailed context
  captureError(error, "grid-manager-creation-error", {
    level: "error",
    tags: {
      component: "gridManager",
      operation: "creation",
      attempt: String(gridProgress.attemptsCount)
    },
    extra: {
      attemptsCount: gridProgress.attemptsCount,
      lastAttemptTime: new Date(gridProgress.lastAttemptTime).toISOString()
    }
  });
};

/**
 * Get grid creation progress
 * @returns {GridProgressState} Current grid creation state
 */
export const getGridProgress = (): GridProgressState => {
  return { ...gridProgress };
};

/**
 * Register a grid instance
 * @param {string} id - Instance identifier
 * @param {FabricObject[]} gridObjects - Grid objects
 */
export const registerGridInstance = (
  id: string,
  gridObjects: FabricObject[]
): void => {
  gridInstances.set(id, gridObjects);
};

/**
 * Check if grid objects are still valid
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to verify
 * @returns {boolean} Whether grid objects are valid
 */
export const validateGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects.length) return false;
  
  try {
    // Check if at least some grid objects are on canvas
    const objectsOnCanvas = gridObjects.filter(obj => {
      try {
        return canvas.contains(obj);
      } catch (error) {
        return false;
      }
    }).length;
    
    return objectsOnCanvas > 0;
  } catch (error) {
    logger.error("Error validating grid objects:", error);
    return false;
  }
};
