
/**
 * Grid state validation
 * Validates GridCreationState objects to ensure they have correct properties
 * @module utils/grid/gridStateValidation
 */
import { GridCreationState, DEFAULT_GRID_CREATION_STATE, GridCreationLock } from '@/types/core/GridTypes';

/**
 * Validates a GridCreationState object to ensure it has valid properties
 * Ensures all properties are of correct types and provides defaults if missing
 * 
 * @param {Partial<GridCreationState>} state - The state object to validate
 * @returns {GridCreationState} The validated state object with any invalid properties fixed
 */
export const validateGridState = (state: Partial<GridCreationState>): GridCreationState => {
  // Start with default state
  const validState: GridCreationState = { ...DEFAULT_GRID_CREATION_STATE };
  
  // Only copy valid properties
  Object.keys(state).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      // Use proper type assertion with keyof
      const typedKey = key as keyof GridCreationState;
      
      // Check if key exists in state
      if (typedKey in state) {
        // Type-safe assignment with proper casting
        const value = state[typedKey];
        // Use type-safe Record to avoid any assignments
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
 * Filters out invalid properties and ensures proper typing
 * 
 * @param {Partial<GridCreationState>} updates - Partial updates to the grid state
 * @returns {Partial<GridCreationState>} A validated update object
 */
export const createGridStateUpdate = (updates: Partial<GridCreationState>): Partial<GridCreationState> => {
  const validUpdates: Partial<GridCreationState> = {};
  
  Object.keys(updates).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      // Use proper type assertion with keyof
      const typedKey = key as keyof GridCreationState;
      
      // Check if key exists in updates
      if (typedKey in updates) {
        // Type-safe assignment with proper casting
        const value = updates[typedKey];
        // Use type-safe Record to avoid any assignments
        (validUpdates as Record<string, unknown>)[typedKey] = value;
      }
    } else {
      console.warn(`Invalid GridCreationState update property: ${key}. This property will be ignored.`);
    }
  });
  
  return validUpdates;
};

/**
 * Common property mapping for incorrectly named properties
 * Maps incorrect property names to their correct equivalents
 * 
 * @type {Record<string, keyof GridCreationState>}
 */
export const GRID_STATE_PROPERTY_MAP: Record<string, keyof GridCreationState> = {
  'visible': 'exists',
  'visibility': 'exists',
  'created': 'isCreated',
  'error': 'errorMessage'
};

/**
 * Repairs a grid state object with incorrectly named properties
 * Converts common misnamed properties to their correct counterparts
 * 
 * @param {Record<string, unknown>} state - The state object to repair
 * @returns {Partial<GridCreationState>} The repaired state object
 */
export const repairGridState = (state: Record<string, unknown>): Partial<GridCreationState> => {
  const repairedState: Partial<GridCreationState> = {};
  
  // Copy all valid properties
  Object.keys(state).forEach(key => {
    if (key in DEFAULT_GRID_CREATION_STATE) {
      // Use proper type assertion with keyof
      const typedKey = key as keyof GridCreationState;
      const value = state[key];
      
      // Type-safe assignment with proper casting
      // Use type-safe Record to avoid any assignments
      (repairedState as Record<string, unknown>)[typedKey] = value;
    } else if (key in GRID_STATE_PROPERTY_MAP) {
      // Map incorrect properties to correct ones
      const correctKey = GRID_STATE_PROPERTY_MAP[key];
      const value = state[key];
      
      // Type-safe assignment with proper casting
      // Use type-safe Record to avoid any assignments
      (repairedState as Record<string, unknown>)[correctKey] = value;
      console.warn(`Renamed GridCreationState property: ${key} → ${correctKey}`);
    }
  });
  
  return repairedState;
};
