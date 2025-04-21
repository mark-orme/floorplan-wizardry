
/**
 * Floor Plan Core Package
 * Core domain logic for floor plans, independent of UI
 * @module packages/floorplan-core
 */

// Re-export geometry types from the core domain
export * from '@/types/core/Geometry';

// Re-export floor plan types explicitly to avoid ambiguity
export {
  PaperSize,
  FloorPlan,
  FloorPlanMetadata,
  Wall,
  Room,
  Stroke
} from '@/types/core/floor-plan';

export type {
  Point, 
  LineSegment, 
  Rectangle, 
  Circle, 
  Polygon, 
  BoundingBox,
  CanvasDimensions,
  Transform
} from '@/types/core/Geometry';

// Re-export core geometry utilities
export * from '@/utils/geometry/engine';

// The floor plan domain model
export { calculatePolygonArea, calculateGIA } from '@/utils/geometry/engine';

// Export domain services
export * from './services';
