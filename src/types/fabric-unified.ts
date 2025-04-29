
/**
 * Centralized Fabric.js type definitions
 * This file serves as the single source of truth for all Fabric.js related types
 * @module types/fabric-unified
 */
import { 
  Canvas as FabricCanvas, 
  Object as FabricObject,
  Line,
  Circle,
  Rect,
  Path,
  Point as FabricPoint,
  Group,
  Polyline,
  ActiveSelection,
} from 'fabric';

// Re-export the native fabric types
export type { 
  FabricCanvas, 
  FabricObject,
  Line,
  Circle, 
  Rect,
  Path,
  FabricPoint,
  Group,
  Polyline,
  ActiveSelection
};

/**
 * Extended fabric canvas type that includes all properties used across the app
 */
export interface ExtendedFabricCanvas extends FabricCanvas {
  /** The DIV wrapper for sizing/DOM events */
  wrapperEl: HTMLElement;
  /** Initialize canvas with element and options */
  initialize: (element: string | HTMLCanvasElement, options?: any) => FabricCanvas;
  /** Whether to skip target finding */
  skipTargetFind?: boolean;
  /** Whether to allow touch scrolling */
  allowTouchScrolling?: boolean;
  /** Whether to skip offscreen rendering */
  skipOffscreen?: boolean;
  /** Whether to render on add/remove */
  renderOnAddRemove: boolean;
  /** Viewport transform matrix */
  viewportTransform?: number[];
  /** Get active object on canvas */
  getActiveObject?: () => FabricObject | null;
  /** Iterate over all objects */
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  /** Zoom to specific point */
  zoomToPoint?: (point: { x: number, y: number }, value: number) => void;
  /** Canvas backgroundColor */
  backgroundColor?: string;
  /** Add objects to canvas */
  add(...objects: FabricObject[]): FabricCanvas;
  /** Remove objects from canvas */
  remove(...objects: FabricObject[]): FabricCanvas;
  /** Get all objects on canvas */
  getObjects(): FabricObject[];
  /** Clear all objects from canvas */
  clear(): FabricCanvas;
  /** Get active objects */
  getActiveObjects?(): FabricObject[];
  /** Discard active object */
  discardActiveObject?(options?: any): FabricCanvas;
  /** Render all objects */
  renderAll(): FabricCanvas;
  /** Request render all on next animation frame */
  requestRenderAll(): FabricCanvas;
  /** Whether the canvas is in drawing mode */
  isDrawingMode?: boolean;
  /** The free drawing brush */
  freeDrawingBrush?: {
    color: string;
    width: number;
    limitedToCanvasSize?: boolean;
    decimate?: number;
  };
  /** Convert canvas to object */
  toObject?(options?: any): any;
  /** Convert canvas to JSON */
  toJSON?(options?: any): any;
  /** Canvas selection flag */
  selection?: boolean;
  /** Set zoom level */
  setZoom?(zoom: number): FabricCanvas;
  /** Get zoom level */
  getZoom?(): number;
}

/**
 * Extended fabric object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  /** Custom object type */
  objectType?: string;
  /** Whether the object is part of grid */
  isGrid?: boolean;
  /** Whether the object is a large grid line */
  isLargeGrid?: boolean;
  /** Whether the object is visible */
  visible?: boolean;
  /** Whether the object can be selected */
  selectable?: boolean;
  /** Whether the object responds to events */
  evented?: boolean;
  /** Set properties on the object */
  set(options: Record<string, any>): FabricObject;
  /** Unique identifier */
  id?: string;
  /** Set coordinates */
  setCoords?(): void;
  /** Additional props */
  data?: any;
  /** Additional props for grid lines */
  isOnScreen?: boolean;
}

/**
 * Fabric event types for canvas events
 */
export enum FabricEventTypes {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',
  OBJECT_ADDED = 'object:added',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_REMOVED = 'object:removed',
  AFTER_RENDER = 'after:render',
  BEFORE_RENDER = 'before:render',
  CANVAS_CLEARED = 'canvas:cleared',
  PATH_CREATED = 'path:created'
}

/**
 * Fabric mouse event info
 */
export interface FabricMouseEvent {
  e: MouseEvent | TouchEvent;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  target?: FabricObject;
}

/**
 * Fabric pointer event for touch and mouse
 */
export type FabricPointerEvent = FabricMouseEvent;

/**
 * Point interface for coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Measurement data for line tools
 */
export interface MeasurementData {
  distance: number;
  angle: number;
  startPoint?: Point;
  endPoint?: Point;
  snapped?: boolean;
  unit?: string;
  snapType?: 'grid' | 'angle' | 'both';
}

/**
 * Canvas state interface
 */
export interface CanvasState {
  tool: string;
  lineColor: string;
  lineThickness: number;
  zoomLevel: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showMeasurements: boolean;
}

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  distance: number;
  cursorPosition: Point;
  currentZoom?: number;
}

/**
 * Create default drawing state
 */
export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    points: [],
    distance: 0,
    cursorPosition: { x: 0, y: 0 }
  };
}

/**
 * Canvas interaction result
 */
export interface UseCanvasStateResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<any>;
  initializeCanvas: () => void;
  disposeCanvas: () => void;
  isInitialized: boolean;
}

/**
 * Gesture types for touch interactions
 */
export type GestureType = 'pinch' | 'rotate' | 'pan';
export type GestureState = 'start' | 'move' | 'end';
export interface GestureStateObject {
  type: GestureType;
  state: GestureState;
  scale?: number;
  rotation?: number;
  translation?: { x: number; y: number };
}

/**
 * Grid constants
 */
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  SNAP_THRESHOLD: 5,
  ANGLE_SNAP_THRESHOLD: 5,
  SMALL_GRID_WIDTH: 0.2,
  LARGE_GRID_WIDTH: 0.5,
  DEFAULT_GRID_VISIBLE: true,
  DEFAULT_SNAP_ENABLED: true,
  GRID_SIZE: {
    SMALL: 10,
    LARGE: 50,
    DEFAULT: 25
  },
  PIXELS_PER_METER: 100
};

// Canvas mocking utilities for tests
export const createMockCanvas = (): ExtendedFabricCanvas => {
  return {
    add: jest.fn(),
    remove: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    renderAll: jest.fn(),
    clear: jest.fn(),
    wrapperEl: document.createElement('div') as HTMLDivElement,
  } as unknown as ExtendedFabricCanvas;
};
