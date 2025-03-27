
/**
 * Grid creation operations
 * Provides utility functions for grid management
 * @module gridOperations
 */
import { Canvas, Object as FabricObject } from "fabric";
import type { GridCreationState } from "@/types";

/**
 * Get initial grid creation state
 * @returns {GridCreationState} Default grid state
 */
export const getInitialGridState = (): GridCreationState => {
  return {
    inProgress: false,
    isCreated: false,
    attempts: 0,
    lastAttemptTime: 0,
    hasError: false,
    errorMessage: "",
    creationInProgress: false,
    consecutiveResets: 0,
    maxConsecutiveResets: 5,
    exists: false,
    lastCreationTime: 0,
    throttleInterval: 500,
    totalCreations: 0,
    maxRecreations: 10,
    minRecreationInterval: 1000,
    creationLock: {
      id: 0,
      timestamp: 0,
      isLocked: false
    }
  };
};

/**
 * Check if grid creation is allowed based on state
 * @param state - Current grid creation state
 * @returns {boolean} True if grid creation is allowed
 */
export const canCreateGrid = (state: GridCreationState): boolean => {
  // Don't allow if creation is already in progress
  if (state.creationInProgress) {
    return false;
  }
  
  // Don't allow if we've reset too many times in a row
  if (state.consecutiveResets !== undefined && 
      state.maxConsecutiveResets !== undefined && 
      state.consecutiveResets >= state.maxConsecutiveResets) {
    return false;
  }
  
  // Don't allow if we've tried too recently
  if (state.lastCreationTime !== undefined && 
      state.throttleInterval !== undefined && 
      Date.now() - state.lastCreationTime < state.throttleInterval) {
    return false;
  }
  
  return true;
};

/**
 * Check if grid recreation is allowed based on state
 * @param state - Current grid creation state
 * @returns {boolean} True if grid recreation is allowed
 */
export const canRecreateGrid = (state: GridCreationState): boolean => {
  // Don't allow if creation is already in progress
  if (state.creationInProgress) {
    return false;
  }
  
  // Don't allow if we've tried too recently
  if (state.lastCreationTime !== undefined && 
      state.throttleInterval !== undefined && 
      Date.now() - state.lastCreationTime < state.throttleInterval) {
    return false;
  }
  
  // Don't allow if grid exists and we've recreated too many times
  if (state.exists && 
      state.totalCreations !== undefined && 
      state.maxRecreations !== undefined && 
      state.minRecreationInterval !== undefined && 
      state.totalCreations >= state.maxRecreations) {
    return false;
  }
  
  // Don't allow if grid exists and we've tried too recently
  if (state.exists && 
      state.lastCreationTime !== undefined && 
      state.minRecreationInterval !== undefined && 
      Date.now() - state.lastCreationTime < state.minRecreationInterval) {
    return false;
  }
  
  return true;
};

/**
 * Update grid creation state with creation start
 * @param state - Current grid creation state
 * @returns {GridCreationState} Updated state
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
 * @param state - Current grid creation state
 * @returns {GridCreationState} Updated state
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
 * @param state - Current grid creation state
 * @param error - Error message
 * @returns {GridCreationState} Updated state
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
 * @param canvas - Canvas instance
 * @param gridObjects - Created grid objects
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
 * @param state - Current grid creation state
 * @returns {GridCreationState} Reset state
 */
export const resetGridCreationState = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    inProgress: false,
    isCreating: false,
    hasError: false,
    errorMessage: "",
    consecutiveResets: (state.consecutiveResets || 0) + 1
  };
};

/**
 * Acquire a creation lock to prevent concurrent operations
 * @param state - Current grid creation state
 * @returns {boolean} True if lock was acquired
 */
export const acquireCreationLock = (state: GridCreationState): boolean => {
  if (state.creationLock && state.creationLock.isLocked === true) {
    return false;
  }
  
  return true;
};

/**
 * Update state with creation lock acquisition
 * @param state - Current grid creation state
 * @returns {GridCreationState} Updated state with lock
 */
export const setCreationLock = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationLock: {
      id: Date.now(),
      timestamp: Date.now(),
      isLocked: true
    }
  };
};

/**
 * Update state with creation lock release
 * @param state - Current grid creation state
 * @returns {GridCreationState} Updated state without lock
 */
export const releaseCreationLock = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationLock: {
      id: 0,
      timestamp: 0,
      isLocked: false
    }
  };
};

/**
 * Update grid creation state with creation in progress
 * @param state - Current grid creation state
 * @returns {GridCreationState} Updated state
 */
export const setCreationInProgress = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationInProgress: true
  };
};

/**
 * Update grid creation state with creation completed
 * @param state - Current grid creation state
 * @returns {GridCreationState} Updated state
 */
export const clearCreationInProgress = (state: GridCreationState): GridCreationState => {
  return {
    ...state,
    creationInProgress: false
  };
};
