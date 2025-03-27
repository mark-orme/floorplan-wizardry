
/**
 * Centralized types export
 * Exports all type definitions from a single location
 * @module types
 */

// Re-export types using named exports to avoid ambiguity
export type { Point } from './core/Point';
export type { DrawingState } from './core/DrawingState';
export type { DebugInfoState } from './core/DebugInfo';
export type { GridCreationState } from './core/GridState';
export type { CanvasDimensions, OperationResult } from './core/Geometry';

// Re-export geometry types
export type { 
  Coordinates,
  Dimension,
  Rectangle,
  Size,
  Vector,
  Bounds,
  LineSegment
} from './core/Geometry';

// Re-export floor plan types
export type {
  Floor,
  FloorOptions,
  FloorMetadata,
  FloorPlan,
  PaperSize,
  Stroke
} from './core/FloorPlan';

// Re-export grid types
export type {
  Grid,
  GridConfig,
  GridDimensions,
  GridOptions,
  GridParameters,
  GridStyle
} from './core/GridState';

// Re-export fabric types
export type {
  FabricCanvasOptions,
  FabricObjectOptions,
  FabricLineOptions
} from './core/Fabric';

// Re-export performance types
export type {
  PerformanceMetrics,
  RenderStats,
  TimingRecord
} from './core/Performance';
