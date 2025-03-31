
/**
 * Grid state validation utilities
 * Provides functions to validate and sanitize grid state objects
 * @module utils/grid/gridStateValidation
 */
import { GridCreationState, GridCreationLock, DEFAULT_GRID_CREATION_STATE } from '@/types/core/GridTypes';

/**
 * Validates a grid state object
 * Ensures all required properties are present and valid
 * 
 * @param {unknown} state - Grid state object to validate
 * @returns {GridCreationState} Validated grid state
 */
export function validateGridState(state: unknown): GridCreationState {
  // If state is not an object or is null, return default state
  if (!state || typeof state !== 'object') {
    return { ...DEFAULT_GRID_CREATION_STATE };
  }
  
  // Initialize with default state
  const validState = { ...DEFAULT_GRID_CREATION_STATE };
  
  // Cast the unknown state to a Record type for safer property access
  const stateRecord = state as Record<string, unknown>;
  
  // Map boolean properties safely
  const booleanProps: Array<keyof GridCreationState> = ['started', 'completed', 'inProgress', 'isCreated', 'hasError', 'creationInProgress', 'exists'];
  
  booleanProps.forEach(prop => {
    if (prop in stateRecord && typeof stateRecord[prop] === 'boolean') {
      validState[prop] = stateRecord[prop] as boolean;
    }
  });
  
  // Map number properties safely
  const numberProps: Array<keyof GridCreationState> = ['objectCount', 'startTime', 'endTime', 'attempts', 'lastAttemptTime', 'consecutiveResets', 'maxConsecutiveResets', 'lastCreationTime', 'throttleInterval', 'totalCreations', 'maxRecreations', 'minRecreationInterval'];
  
  numberProps.forEach(prop => {
    if (prop in stateRecord && typeof stateRecord[prop] === 'number') {
      validState[prop] = stateRecord[prop] as number;
    }
  });
  
  // Map string properties safely
  const stringProps: Array<keyof GridCreationState> = ['error', 'errorMessage'];
  
  stringProps.forEach(prop => {
    if (prop in stateRecord && typeof stateRecord[prop] === 'string') {
      validState[prop] = stateRecord[prop] as string;
    }
  });
  
  // Handle creationLock object separately
  if ('creationLock' in stateRecord && stateRecord.creationLock && typeof stateRecord.creationLock === 'object') {
    const lockRecord = stateRecord.creationLock as Record<string, unknown>;
    
    // Deep copy the creationLock to prevent mutations
    validState.creationLock = { ...DEFAULT_GRID_CREATION_STATE.creationLock };
    
    // Update creationLock properties if valid
    if ('isLocked' in lockRecord && typeof lockRecord.isLocked === 'boolean') {
      validState.creationLock.isLocked = lockRecord.isLocked;
    }
    
    if ('lockedBy' in lockRecord && typeof lockRecord.lockedBy === 'string') {
      validState.creationLock.lockedBy = lockRecord.lockedBy;
    }
    
    if ('lockedAt' in lockRecord && typeof lockRecord.lockedAt === 'number') {
      validState.creationLock.lockedAt = lockRecord.lockedAt;
    }
    
    // Make sure to use only properties that exist on GridCreationLock
    if ('maxLockTime' in lockRecord && typeof lockRecord.maxLockTime === 'number') {
      validState.creationLock.maxLockTime = lockRecord.maxLockTime;
    }
    
    // Using lockExpiresAt instead of expireAt
    if ('lockExpiresAt' in lockRecord && typeof lockRecord.lockExpiresAt === 'number') {
      validState.creationLock.lockExpiresAt = lockRecord.lockExpiresAt;
    }
  }
  
  return validState;
}

/**
 * Creates a new grid state object with updated properties
 * 
 * @param {Partial<GridCreationState>} updates - Properties to update
 * @returns {GridCreationState} Updated grid state
 */
export function createGridState(updates: Partial<GridCreationState>): GridCreationState {
  return {
    ...DEFAULT_GRID_CREATION_STATE,
    ...updates
  };
}

/**
 * Checks if grid creation is in progress
 * 
 * @param {GridCreationState} state - Grid state to check
 * @returns {boolean} Whether grid creation is in progress
 */
export function isGridCreationInProgress(state: GridCreationState): boolean {
  return state.inProgress === true || state.creationInProgress === true;
}

/**
 * Check if grid has been successfully created
 * 
 * @param {GridCreationState} state - Grid state to check
 * @returns {boolean} Whether grid has been created
 */
export function isGridCreated(state: GridCreationState): boolean {
  return state.completed === true && state.hasError !== true;
}
