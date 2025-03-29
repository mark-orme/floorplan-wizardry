
/**
 * Grid module index
 * Exports all grid-related utilities
 * @module grid
 */

// Export constants
export * from './constants';

// Export creation utilities
export * from './gridCreation';

// Export validation utilities
export * from './gridValidation';

// Export error handling
export * from './errorHandling';

// Export debug utilities
export * from './gridDebugUtils';

// Export throttling utilities
export * from './consoleThrottling';

// Export specific constants needed by other modules
export const GRID_CREATION_COOLDOWN = 1000;
export const MAX_CREATE_ATTEMPTS = 3;

// Export additional utilities
export const acquireGridLockWithSafety = (id: number): boolean => {
  // Simple implementation - in a real app, this would be more robust
  return true;
};

export const cleanupGridResources = (): void => {
  // Implementation for cleaning up grid resources
  console.log("Grid resources cleaned up");
};

// REMOVED: Direct export of createBasicEmergencyGrid to resolve ambiguity
// This function is already exported from './gridCreation'
// Import it directly from the specific module instead:
// import { createBasicEmergencyGrid } from "@/utils/grid/gridCreation";
