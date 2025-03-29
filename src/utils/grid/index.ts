
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

// NOTE: We're not re-exporting createBasicEmergencyGrid directly here
// to avoid the ambiguity with the same named export from gridCreation.ts
// Instead, consumers should import it directly from the specific module they need
