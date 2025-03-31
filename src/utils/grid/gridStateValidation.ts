
/**
 * Grid state validation
 * Validates GridCreationState objects to ensure they have correct properties
 * @module utils/grid/gridStateValidation
 */
import { GridCreationState, DEFAULT_GRID_CREATION_STATE } from '@/types/core/GridTypes';

/**
 * Validates a GridCreationState object to ensure it has valid properties
 * @param state - The state object to validate
 * @returns The validated state object with any invalid properties fixed
 */
export const validateGridState = (state: Partial<GridCreationState>): GridCreationState => {
  // Start with default state
  const validState: GridCreationState = { ...DEFAULT_GRID_CREATION_STATE };
  
  // Only copy valid properties
  Object.keys(state).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      const typedKey = key as keyof GridCreationState;
      // Use type assertion to fix the "never" type error
      validState[typedKey] = state[typedKey] as GridCreationState[typeof typedKey];
    } else {
      console.warn(`Invalid GridCreationState property: ${key}. This property will be ignored.`);
    }
  });
  
  return validState;
};

/**
 * Creates a valid grid state update object
 * @param updates - Partial updates to the grid state
 * @returns A validated update object
 */
export const createGridStateUpdate = (updates: Partial<GridCreationState>): Partial<GridCreationState> => {
  const validUpdates: Partial<GridCreationState> = {};
  
  Object.keys(updates).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      const typedKey = key as keyof GridCreationState;
      // Use type assertion to fix the "never" type error
      validUpdates[typedKey] = updates[typedKey] as GridCreationState[typeof typedKey];
    } else {
      console.warn(`Invalid GridCreationState update property: ${key}. This property will be ignored.`);
    }
  });
  
  return validUpdates;
};

/**
 * Common property mapping for incorrectly named properties
 * Maps incorrect property names to their correct equivalents
 */
export const GRID_STATE_PROPERTY_MAP: Record<string, keyof GridCreationState> = {
  'visible': 'exists',
  'visibility': 'exists',
  'created': 'isCreated',
  'error': 'errorMessage'
};

/**
 * Repairs a grid state object with incorrectly named properties
 * @param state - The state object to repair
 * @returns The repaired state object
 */
export const repairGridState = (state: Record<string, unknown>): Partial<GridCreationState> => {
  const repairedState: Partial<GridCreationState> = {};
  
  // Copy all valid properties
  Object.keys(state).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      // Use proper type-safe way to copy properties
      const typedKey = key as keyof GridCreationState;
      // Type the value specifically for this property
      repairedState[typedKey] = state[key] as GridCreationState[typeof typedKey];
    } else if (key in GRID_STATE_PROPERTY_MAP) {
      // Map incorrect properties to correct ones
      const correctKey = GRID_STATE_PROPERTY_MAP[key];
      // Type the value specifically for this property
      repairedState[correctKey] = state[key] as GridCreationState[typeof correctKey];
      console.warn(`Renamed GridCreationState property: ${key} → ${correctKey}`);
    }
  });
  
  return repairedState;
};
