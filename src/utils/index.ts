
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

// Re-export from geometry utilities but explicitly rename potentially ambiguous exports
export { 
  calculateArea,
  calculateGIA,
  rotatePoint,
  translatePoint,
  scalePoint,
  validatePolygon,
  isPolygonClosed,
  getBoundingBox,
  getMidpoint,
  pixelsToMeters,
  metersToPixels,
  simplifyPath,
  smoothPath,
  calculateDistance,
  formatDistance,
  isExactGridMultiple,
  calculateMidpoint,
  calculateAngle,
  getDistance,
  formatDisplayDistance
} from './geometry/engine';

// Re-export grid-related functions from their exports file
export { 
  GridCreation, 
  GridValidation, 
  GridDebug,
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
export * from './grid';
