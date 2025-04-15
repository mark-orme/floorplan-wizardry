
/**
 * Utils barrel file
 * Re-exports all utility functions and constants
 * @module utils
 */

// Re-export from validation
export * from './validation';

// Re-export from security
export * from './security';

// Re-export from fabric utilities
export * from './fabric';

// Re-export from fabricPath utilities
export * from './fabricPath';

// Re-export from geometry utilities
export * from './geometry';

// Re-export grid utilities with explicit naming
export {
  snapPointToGrid, 
  snapLineToGrid,
  snapLineToStandardAngles,
  snapToAngle,
  isPointOnGrid,
  getNearestGridPoint,
  distanceToGrid,
  distanceToGridLine
} from './grid/exports';

// Re-export remaining grid utilities
export * from './grid/exports';
