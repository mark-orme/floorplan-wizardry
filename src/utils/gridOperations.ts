/**
 * Grid creation operations
 * Provides utility functions for grid management
 * @module gridOperations
 */
import { Canvas, Object as FabricObject } from "fabric";
import type { GridCreationState, GridCreationLock } from "@/types/core/GridTypes";
import { DEFAULT_GRID_CREATION_STATE, DEFAULT_GRID_CREATION_LOCK } from "@/types/core/GridTypes";
import { isGridCreationLock, validateGridCreationLock } from "@/types/grid/GridCreationLock";

/**
 * Get initial grid creation state
 * Creates a properly configured GridCreationState with default values
 * 
 * @returns {GridCreationState} Default grid state with all required properties
 */
export const getInitialGridState = (): GridCreationState => {
  // Use the default grid creation state as a base
  return {
    ...DEFAULT_GRID_CREATION_STATE,
    // Any additional initialization can be done here
  };
};

/**
 * Check if grid creation is allowed based on state
 * Prevents too frequent calls or excessive attempts
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {boolean} True if grid creation is allowed
 */
export const canCreateGrid = (state: GridCreationState): boolean => {
  // Don't allow if creation is already in progress
  if (state.creationInProgress) {
    return false;
  }
  
  // Don't allow if we've reset too many times in a row
  if (state.consecutiveResets >= state.maxConsecutiveResets) {
    return false;
  }
  
  // Don't allow if we've tried too recently (throttle)
  if (Date.now() - state.lastCreationTime < state.throttleInterval) {
    return false;
  }
  
  return true;
};

/**
 * Check if grid recreation is allowed based on state
 * Similar to canCreateGrid but with additional recreation-specific checks
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {boolean} True if grid recreation is allowed
 */
export const canRecreateGrid = (state: GridCreationState): boolean => {
  // Don't allow if creation is already in progress
  if (state.creationInProgress) {
    return false;
  }
  
  // Don't allow if we've tried too recently (throttle)
  if (Date.now() - state.lastCreationTime < state.throttleInterval) {
    return false;
  }
  
  // Don't allow if grid exists and we've recreated too many times
  if (state.exists && state.totalCreations >= state.maxRecreations) {
    return false;
  }
  
  // Don't allow if grid exists and we've tried too recently
  if (state.exists && Date.now() - state.lastCreationTime < state.minRecreationInterval) {
    return false;
  }
  
  return true;
};

/**
 * Update grid creation state with creation start
 * Marks the beginning of a grid creation operation
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Updated state with creation started
 */
export const startGridCreation = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    inProgress: true,
    attempts: state.attempts + 1,
    lastAttemptTime: Date.now(),
    hasError: false,
    errorMessage: ""
  };
};

/**
 * Update grid creation state with successful creation
 * Records successful grid creation and resets error counter
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Updated state with creation complete
 */
export const completeGridCreation = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    inProgress: false,
    isCreated: true,
    lastAttemptTime: Date.now(),
    hasError: false,
    consecutiveResets: 0,
    exists: true,
    lastCreationTime: Date.now(),
    totalCreations: (state.totalCreations || 0) + 1
  };
};

/**
 * Update grid creation state with failed creation
 * Records error information and increments reset counter
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @param {string} error - Error message
 * @returns {GridCreationState} Updated state with error information
 */
export const failGridCreation = (state: GridCreationState, error: string): GridCreationState => {
  return {
    ...state,
    inProgress: false,
    hasError: true,
    errorMessage: error,
    consecutiveResets: (state.consecutiveResets || 0) + 1,
    lastAttemptTime: Date.now()
  };
};

/**
 * Verify if grid creation was successful
 * Checks if grid objects were actually created and added to canvas
 * 
 * @param {Canvas | null} canvas - Canvas instance
 * @param {FabricObject[]} gridObjects - Created grid objects
 * @returns {boolean} True if grid creation was successful
 */
export const verifyGridCreation = (
  canvas: Canvas | null,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  
  // Check if we have grid objects
  if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
    return false;
  }
  
  // Check if they're on the canvas
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return objectsOnCanvas.length > 0;
};

/**
 * Reset grid creation state for a fresh attempt
 * Preserves some state while resetting error flags
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Reset state ready for a new attempt
 */
export const resetGridCreationState = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    inProgress: false,
    creationInProgress: false, // Fixed property name from isCreating to creationInProgress
    hasError: false,
    errorMessage: "",
    consecutiveResets: (state.consecutiveResets || 0) + 1
  };
};

/**
 * Acquire a creation lock to prevent concurrent operations
 * Checks if a lock is already held
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {boolean} True if lock was acquired
 */
export const acquireCreationLock = (state: GridCreationState): boolean => {
  // Check if lock exists and is active
  if (state.creationLock && state.creationLock.isLocked === true) {
    return false;
  }
  
  return true;
};

/**
 * Update state with creation lock acquisition
 * Sets lock with new timestamp and ID
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Updated state with lock acquired
 */
export const setCreationLock = (state: GridCreationState): GridCreationState => {
  const currentTime = Date.now();
  const maxLockTime = 5000;
  
  return {
    ...state,
    creationLock: {
      isLocked: true,
      lockedBy: "lock-" + currentTime.toString(),
      lockedAt: currentTime,
      maxLockTime: maxLockTime,
      lockExpiresAt: currentTime + maxLockTime
    }
  };
};

/**
 * Update state with creation lock release
 * Clears lock by resetting all lock properties
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Updated state with lock released
 */
export const releaseCreationLock = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationLock: {
      isLocked: false,
      lockedBy: null,
      lockedAt: null,
      maxLockTime: 5000,
      lockExpiresAt: 0
    }
  };
};

/**
 * Update grid creation state with creation in progress
 * Marks that creation has started
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Updated state with creation flagged as in progress
 */
export const setCreationInProgress = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationInProgress: true
  };
};

/**
 * Update grid creation state with creation completed
 * Marks that creation is no longer in progress
 * 
 * @param {GridCreationState} state - Current grid creation state
 * @returns {GridCreationState} Updated state with creation flag cleared
 */
export const clearCreationInProgress = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationInProgress: false
  };
};
