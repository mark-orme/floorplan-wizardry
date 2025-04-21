

/**
 * Core types index
 * Re-exports all core type definitions
 */

// Export geometry types as types
export type {
  Point,
  Rectangle,
  Circle,
  Polygon,
  BoundingBox,
  TransformMatrix,
  LineSegment,
  CanvasDimensions,
  Transform
} from './Geometry';

// Export performance types as types/constants
export type { 
  PerformanceStats
} from './PerformanceStats';
export { 
  DEFAULT_PERFORMANCE_STATS 
} from './PerformanceStats';

// Add other core type exports as needed

