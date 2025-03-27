
/**
 * Centralized types export
 * Exports all type definitions from a single location
 * @module types
 */

// Re-export types using named exports to avoid ambiguity
export type { Point, CanvasDimensions, OperationResult, GridCreationState } from './drawingTypes';
export type { DrawingState } from './drawingStateTypes';
export type { DebugInfoState } from './debugTypes';

// Re-export other types
export type { 
  Coordinates, 
  Dimension, 
  Rectangle, 
  Size, 
  Vector,
  Bounds,
  LineSegment
} from './geometryTypes';

export type {
  Floor,
  FloorOptions,
  FloorMetadata,
  FloorPlan,
  PaperSize,
  Stroke
} from './floorPlanTypes';

export type {
  Grid,
  GridConfig,
  GridDimensions,
  GridOptions,
  GridParameters,
  GridStyle
} from './gridTypes';

export type {
  FabricCanvasOptions,
  FabricObjectOptions,
  FabricLineOptions
} from './fabricTypes';

export type {
  PerformanceMetrics,
  RenderStats,
  TimingRecord
} from './performanceTypes';
