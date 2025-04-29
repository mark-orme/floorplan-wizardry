
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
  Point as FabricPoint
} from 'fabric';

// Re-export the native fabric types
export type { 
  FabricCanvas, 
  FabricObject,
  Line,
  Circle, 
  Rect,
  Path,
  FabricPoint
};

/**
 * Extended fabric canvas type that includes all properties used across the app
 */
export interface ExtendedFabricCanvas extends FabricCanvas {
  /** The DIV wrapper for sizing/DOM events */
  wrapperEl: HTMLDivElement;
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
}

/**
 * Extended fabric object with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  /** Custom object type */
  objectType?: string;
  /** Whether the object is part of grid */
  isGrid?: boolean;
  /** Whether the object is visible */
  visible?: boolean;
  /** Whether the object can be selected */
  selectable?: boolean;
  /** Whether the object responds to events */
  evented?: boolean;
  /** Set properties on the object */
  set: (options: Record<string, any>) => FabricObject;
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
  startPoint: Point;
  endPoint: Point;
  snapped?: boolean;
  unit?: string;
  snapType?: 'grid' | 'angle' | 'both';
}

/**
 * Grid constants
 */
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE: 10,
  LARGE_GRID_SIZE: 50,
  SMALL_GRID_COLOR: '#e0e0e0',
  LARGE_GRID_COLOR: '#c0c0c0',
  SNAP_THRESHOLD: 5
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
