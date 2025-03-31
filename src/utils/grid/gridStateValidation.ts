
/**
 * Grid state validation
 * Validates GridCreationState objects to ensure they have correct properties
 * @module utils/grid/gridStateValidation
 */
import { GridCreationState, DEFAULT_GRID_CREATION_STATE, GridCreationLock } from '@/types/core/GridTypes';

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
      
      // Type-safe assignment using indexed access types
      if (typedKey in state) {
        const value = state[typedKey];
        // Use proper type assertion with explicit property access
        (validState as Record<string, unknown>)[typedKey] = value;
      }
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
  const validUpdates: Partial<Record<keyof GridCreationState, unknown>> = {};
  
  Object.keys(updates).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      const typedKey = key as keyof GridCreationState;
      
      // Type-safe assignment using indexed access types
      if (typedKey in updates) {
        const value = updates[typedKey];
        // Use proper type assertion with explicit property access
        (validUpdates as Record<string, unknown>)[typedKey] = value;
      }
    } else {
      console.warn(`Invalid GridCreationState update property: ${key}. This property will be ignored.`);
    }
  });
  
  return validUpdates as Partial<GridCreationState>;
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
  const repairedState: Partial<Record<keyof GridCreationState, unknown>> = {};
  
  // Copy all valid properties
  Object.keys(state).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      // Use proper type-safe way to copy properties
      const typedKey = key as keyof GridCreationState;
      const value = state[key];
      
      // Type-safe assignment with proper casting
      (repairedState as Record<string, unknown>)[typedKey] = value;
    } else if (key in GRID_STATE_PROPERTY_MAP) {
      // Map incorrect properties to correct ones
      const correctKey = GRID_STATE_PROPERTY_MAP[key];
      const value = state[key];
      
      // Type-safe assignment with proper casting
      (repairedState as Record<string, unknown>)[correctKey] = value;
      console.warn(`Renamed GridCreationState property: ${key} → ${correctKey}`);
    }
  });
  
  return repairedState as Partial<GridCreationState>;
};
