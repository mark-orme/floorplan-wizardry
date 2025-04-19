/**
 * Common types for drawing operations
 */

// Simple point interface for coordinates
export interface Point {
  x: number;
  y: number;
}

// Drawing tool types
export enum DrawingTool {
  SELECT = 'select',
  DRAW = 'draw',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  POLYGON = 'polygon',
  TEXT = 'text',
  ERASER = 'eraser',
  HAND = 'hand'
}

// Direction for zoom operations
export type ZoomDirection = 'in' | 'out';

// Gesture types
export enum GestureType {
  PINCH = 'pinch',
  ROTATE = 'rotate',
  PAN = 'pan',
  TAP = 'tap',
  DOUBLETAP = 'doubletap',
  TWOFINGERTAP = 'twofingertap',
  THREEFINGERTAP = 'threefingertap',
  FOURFINGERTAP = 'fourfingertap'
}

// Gesture state
export interface GestureState {
  type: GestureType;
  center: Point;
  scale?: number;
  rotation?: number;
  velocity?: number;
  distance?: number;
  fingers?: number;
}

// Canvas dimensions
export interface CanvasDimensions {
  width: number;
  height: number;
}

// Drawing state
export interface DrawingState {
  isDrawing: boolean;
  zoomLevel: number;
  lastX: number;
  lastY: number;
  startX: number;
  startY: number;
  currentPath: any | null;
  usePressure: boolean;
  stylusDetected: boolean;
  pathDragging: boolean;
  creatingShape: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  cursorPosition: Point | null;
  midPoint: Point | null;
  selectionActive: boolean;
  currentZoom: number;
  points: Point[];
  distance: number | null;
}

// Create default drawing state
export const createDefaultDrawingState = (): DrawingState => ({
  isDrawing: false,
  zoomLevel: 1,
  lastX: 0,
  lastY: 0,
  startX: 0,
  startY: 0,
  currentPath: null,
  usePressure: true,
  stylusDetected: false,
  pathDragging: false,
  creatingShape: false,
  startPoint: null,
  currentPoint: null,
  cursorPosition: null,
  midPoint: null,
  selectionActive: false,
  currentZoom: 1,
  points: [],
  distance: null
});

// Debug info state
export interface DebugInfoState {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  zoomLevel: number;
  gridVisible: boolean;
  canvasWidth: number;
  canvasHeight: number;
  lastRenderTime: number;
  eventCount: number;
  
  // Added properties to match core/DebugInfo version
  hasError?: boolean;
  errorMessage?: string;
  lastInitTime?: number;
  lastGridCreationTime?: number;
  eventHandlersSet?: boolean;
  canvasEventsRegistered?: boolean;
  gridRendered?: boolean;
  toolsInitialized?: boolean;
  gridCreated?: boolean;
  canvasInitialized?: boolean;
  dimensionsSet?: boolean;
  brushInitialized?: boolean;
  canvasReady?: boolean;
  canvasCreated?: boolean;
  performanceStats?: any;
  showDebugInfo?: boolean;
  lastError?: string;
  lastRefresh?: number;
  lastErrorTime?: number;
}

// Performance stats
export interface PerformanceStats {
  fps: number;
  renderTime: number;
  objectCount: number;
  lastUpdate: number;
}

// Distance tool state
export interface DistanceToolState {
  active: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
  distance: number | null;
  angle: number | null;
}
