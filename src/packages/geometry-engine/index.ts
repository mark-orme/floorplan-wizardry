
/**
 * Geometry Engine
 * Export all functionality from the geometry engine
 */

// Export core functions
export { 
  calculateDistance,
  calculateAngle,
  perpendicularDistance,
  linesIntersect
} from './core';

// Export simplification utilities
export { 
  simplifyPolyline 
} from './simplification';

// Export snapping utilities
export { 
  snapToGrid,
  snapToPoints,
  isWithinSnappingDistance
} from './snapping';

// Export validation utilities
export { 
  isValidPoint,
  isValidLine,
  isValidPolygon
} from './validation';

// Export core types
export type { 
  Point,
  LineSegment,
  Line,
  WorkerMessageData,
  WorkerResponseData
} from './types';

// This ensures typescript's isolatedModules can properly handle type exports
export type * from './types';
