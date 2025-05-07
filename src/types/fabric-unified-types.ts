
/**
 * Unified Fabric.js type definitions
 * Provides consistent type definitions for Fabric.js objects and events
 */
import { Canvas, Object as FabricObject, Point, IEvent } from 'fabric';

/**
 * Extended Fabric canvas interface with additional properties
 */
export interface ExtendedFabricCanvas extends Canvas {
  // Properties
  wrapperEl: HTMLDivElement;
  upperCanvasEl: HTMLCanvasElement;
  isDrawingMode: boolean;
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
  skipTargetFind: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove: boolean;
  viewportTransform: number[];
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  
  // Methods
  getActiveObject(): FabricObject | null;
  getActiveObjects(): FabricObject[];
  forEachObject(callback: (obj: FabricObject) => void): void;
  zoomToPoint(point: Point, value: number): Canvas;
  discardActiveObject(options?: any): Canvas;
  contains(obj: FabricObject): boolean;
  getWidth(): number;
  getHeight(): number;
  setZoom(zoom: number): Canvas;
  getZoom(): number;
}

/**
 * Extended Fabric object type with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  name?: string;
  layerId?: string;
  objectType?: string;
  isCustomObject?: boolean;
  isGridLine?: boolean;
  evented?: boolean;
  customProps?: Record<string, any>;
}

/**
 * Type guard to check if an object is an ExtendedFabricCanvas
 */
export function isExtendedFabricCanvas(canvas: any): canvas is ExtendedFabricCanvas {
  return (
    canvas &&
    typeof canvas === 'object' &&
    'wrapperEl' in canvas &&
    'upperCanvasEl' in canvas &&
    'getActiveObject' in canvas &&
    'forEachObject' in canvas
  );
}

/**
 * Type guard to check if an object is an ExtendedFabricObject
 */
export function isExtendedFabricObject(obj: any): obj is ExtendedFabricObject {
  return (
    obj &&
    typeof obj === 'object' &&
    'set' in obj &&
    'setCoords' in obj
  );
}

/**
 * Cast a fabric canvas to an extended fabric canvas
 */
export function asExtendedCanvas(canvas: Canvas | null): ExtendedFabricCanvas | null {
  return canvas as ExtendedFabricCanvas | null;
}

/**
 * Cast a fabric object to an extended fabric object
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}

/**
 * Convert point-like object to fabric Point
 */
export function toFabricPoint(point: { x: number; y: number }): Point {
  return new Point(point.x, point.y);
}

/**
 * Convert fabric Point to plain object
 */
export function fromFabricPoint(point: Point): { x: number; y: number } {
  return { x: point.x, y: point.y };
}

/**
 * Fabric.js event with target type
 */
export interface FabricEventWithTarget<T = FabricObject> extends IEvent {
  target: T | null;
}

// Re-export common Fabric.js types
export type { Canvas, FabricObject, Point, IEvent };

/**
 * Common event types for Fabric.js
 */
export enum FabricEvents {
  OBJECT_ADDED = 'object:added',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_REMOVED = 'object:removed',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  MOUSE_OUT = 'mouse:out'
}

/**
 * Types for Fabric.js mouse events
 */
export interface FabricMouseEvent {
  e: MouseEvent;
  target?: FabricObject;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
}

/**
 * Types for Fabric.js touch events
 */
export interface FabricTouchEvent {
  e: TouchEvent;
  target?: FabricObject;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
}

/**
 * Unified type for pointer events
 */
export type FabricPointerEvent = FabricMouseEvent | FabricTouchEvent;

/**
 * Type guard to check if an event is a touch event
 */
export function isTouchEvent(event: FabricPointerEvent): event is FabricTouchEvent {
  return 'touches' in event.e;
}

/**
 * Type guard to check if an event is a mouse event
 */
export function isMouseEvent(event: FabricPointerEvent): event is FabricMouseEvent {
  return !('touches' in event.e);
}
