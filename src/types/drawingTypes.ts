
/**
 * Drawing-related type definitions
 * @module types/drawingTypes
 */

/**
 * Canvas dimensions
 */
export interface CanvasDimensions {
  /** Canvas width */
  width: number;
  /** Canvas height */
  height: number;
}

/**
 * Point coordinates
 */
export interface Point {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Performance statistics
 */
export interface PerformanceStats {
  /** Frames per second */
  fps?: number;
  /** Average frame time in milliseconds */
  frameTime?: number;
  /** Maximum frame time in milliseconds */
  maxFrameTime?: number;
  /** Number of frames that took too long to render */
  longFrames?: number;
  /** Number of dropped frames */
  droppedFrames?: number;
  /** Memory usage in MB */
  memory?: number;
  /** Number of canvas objects */
  objectCount?: number;
  /** Number of draw calls */
  drawCalls?: number;
  /** Render time in milliseconds */
  renderTime?: number;
  /** Event processing time in milliseconds */
  eventTime?: number;
  /** Custom performance metrics */
  [key: string]: number | undefined;
}

/**
 * Debug information state
 * Importing from debugTypes to ensure consistency
 */
export type { DebugInfoState } from './debugTypes';

/**
 * Drawing state
 */
export interface DrawingState {
  /** Whether currently drawing */
  isDrawing: boolean;
  /** Current zoom level */
  zoomLevel: number;
  /** Last X coordinate */
  lastX: number;
  /** Last Y coordinate */
  lastY: number;
  /** Start X coordinate */
  startX: number;
  /** Start Y coordinate */
  startY: number;
  /** Current path being drawn */
  currentPath: any | null;
  /** Whether to use pressure sensitivity */
  usePressure: boolean;
  /** Whether stylus is detected */
  stylusDetected: boolean;
  /** Whether path dragging is enabled */
  pathDragging: boolean;
  /** Whether shape creation is in progress */
  creatingShape: boolean;
  /** Current zoom level for compatibility */
  currentZoom: number;
  /** Start point for compatibility */
  startPoint: Point | null;
  /** Current point for compatibility */
  currentPoint: Point | null;
  /** Mid point for compatibility */
  midPoint: Point | null;
  /** Whether selection is active for compatibility */
  selectionActive: boolean;
  /** Points array for compatibility */
  points: Point[];
  /** Distance for compatibility */
  distance: number | null;
}

/**
 * Drawing mode
 */
export type DrawingMode = 'free' | 'straight' | 'polygon' | 'rectangle' | 'circle' | 'text';

/**
 * Canvas operation types
 */
export type CanvasOperation = 'draw' | 'erase' | 'select' | 'move' | 'zoom' | 'measure' | 'text';

/**
 * Type for zoom direction values
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Canvas events map for type-safe event handling
 */
export interface CanvasEvents {
  'object:added': any;
  'object:removed': any;
  'object:modified': any;
  'object:selected': any;
  'selection:cleared': any;
  'mouse:down': any;
  'mouse:move': any;
  'mouse:up': any;
  'path:created': any;
  'zoom:updated': any;
}
