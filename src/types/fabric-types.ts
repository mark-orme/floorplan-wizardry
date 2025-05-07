
import { Canvas, Object as FabricObject, IEvent, Point } from 'fabric';

/**
 * Extended fabric canvas type with additional properties 
 */
export interface ExtendedFabricCanvas extends Canvas {
  /** The DIV wrapper for sizing/DOM events */
  wrapperEl: HTMLDivElement;

  /** Canvas elements */
  upperCanvasEl: HTMLCanvasElement;

  /** Optional helpers your hooks use */
  initialize: (element: string | HTMLCanvasElement, options?: any) => Canvas;
  skipTargetFind?: boolean;
  allowTouchScrolling?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  viewportTransform?: number[];
  
  /** Additional methods that might be needed by components */
  getActiveObject: () => FabricObject | null;
  getActiveObjects: () => FabricObject[];
  forEachObject: (callback: (obj: FabricObject) => void) => void;
  zoomToPoint: (point: Point, value: number) => void;
  discardActiveObject: (options?: any) => Canvas;
  contains: (obj: FabricObject) => boolean;
  getWidth: () => number;
  getHeight: () => number;
  setZoom: (zoom: number) => Canvas;
  getZoom: () => number;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
}

/**
 * Extended fabric object type with additional properties
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
export function asExtendedCanvas(canvas: Canvas): ExtendedFabricCanvas {
  return canvas as ExtendedFabricCanvas;
}

/**
 * Cast a fabric object to an extended fabric object
 */
export function asExtendedObject(obj: FabricObject): ExtendedFabricObject {
  return obj as ExtendedFabricObject;
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

export type { Canvas, FabricObject, Point, IEvent };
