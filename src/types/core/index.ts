
/**
 * Core types module
 * Re-exports all core type definitions
 * @module types/core
 */

// Re-export from geometry - exclude PaperSize to avoid ambiguity
import * as GeometryTypes from './Geometry';
export type {
  Point,
  LineSegment,
  Rectangle,
  Circle,
  Polygon,
  BoundingBox,
  CanvasDimensions,
  Transform
} from './Geometry';

// Re-export from drawing
export * from './DrawingTool';

// Re-export floor plan types
export * from './floor-plan';

// Re-export canvas types - fixed import paths
export * from './Canvas';
export * from './CanvasObject';
