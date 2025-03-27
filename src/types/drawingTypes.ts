
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
 * Debug information state
 */
export interface DebugInfoState {
  /** Whether canvas is initialized */
  canvasInitialized: boolean;
  /** Whether dimensions are set */
  dimensionsSet: boolean;
  /** Whether grid is created */
  gridCreated: boolean;
  /** Whether event handlers are set */
  eventHandlersSet: boolean;
  /** Whether brush is initialized */
  brushInitialized: boolean;
  /** Any additional debug info */
  [key: string]: boolean | number | string;
}

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
}

/**
 * Drawing mode
 */
export type DrawingMode = 'free' | 'straight' | 'polygon' | 'rectangle' | 'circle' | 'text';

/**
 * Canvas operation types
 */
export type CanvasOperation = 'draw' | 'erase' | 'select' | 'move' | 'zoom' | 'measure' | 'text';
