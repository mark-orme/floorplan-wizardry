
/**
 * Unified Fabric Types
 * Provides compatibility across different Fabric.js versions
 */
import { Object as FabricObject, Canvas, IObjectOptions } from 'fabric';

// Re-export standard types
export type { Canvas, FabricObject };

// Create a unified Point type
export interface Point {
  x: number;
  y: number;
}

// Extended canvas interface with additional properties
export interface ExtendedCanvas extends Canvas {
  wrapperEl: HTMLDivElement;
  upperCanvasEl?: HTMLCanvasElement;
  isDrawingMode?: boolean;
  selection?: boolean;
  skipTargetFind?: boolean;
  skipOffscreen?: boolean;
  renderOnAddRemove?: boolean;
  viewportTransform?: number[];
  absolutePointer?: Point;
  relativePointer?: Point;
  freeDrawingBrush?: {
    color: string;
    width: number;
  };
  
  // Additional methods that might be missing in some types
  getActiveObject?: () => FabricObject | null;
  forEachObject?: (callback: (obj: FabricObject) => void) => void;
  zoomToPoint?: (point: Point, value: number) => Canvas;
  setWidth?(width: number): Canvas;
  setHeight?(height: number): Canvas;
  getWidth?(): number;
  getHeight?(): number;
  getZoom?(): number;
  setZoom?(zoom: number): Canvas;
  clear?(): Canvas;
  toJSON?(propertiesToInclude?: string[]): any;
}

// Extended object interface with additional properties
export interface ExtendedObject extends FabricObject {
  id?: string;
  objectType?: string;
  visible?: boolean;
  selectable?: boolean;
  evented?: boolean;
  excludeFromExport?: boolean | (() => void);
  
  // Ensure proper method implementations
  set(options: Record<string, any>): this;
  set(property: string, value: any): this;
  setCoords?(): this;
}

// Unified path options
export interface PathOptions extends IObjectOptions {
  path?: string | Point[];
  objectType?: string;
  evented?: boolean;
  selectable?: boolean;
}

// Unified line options
export interface LineOptions extends IObjectOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stroke?: string;
  strokeWidth?: number;
  evented?: boolean;
  selectable?: boolean;
  objectType?: string;
}

// Unified measurement data
export interface MeasurementData {
  distance: number;
  angle: number;
  units: string;
  precision?: number;
  formatted?: string;
  snapped: boolean;
  unit: string;
}

// Typeguards for fabric objects
export function isPathObject(obj: any): boolean {
  return obj && obj.type === 'path';
}

export function isLineObject(obj: any): boolean {
  return obj && obj.type === 'line';
}

/**
 * Common event handler signature for Fabric.js events
 */
export type FabricEventHandler<T = any> = (e: T) => void;

/**
 * Canvas event type
 */
export interface CanvasEvent<T = any> {
  e?: T;
  target?: FabricObject;
  pointer?: Point;
  absolutePointer?: Point;
}

/**
 * Mouse event type
 */
export interface CanvasMouseEvent extends CanvasEvent<MouseEvent> {
  button?: number;
}

/**
 * Touch event type
 */
export interface CanvasTouchEvent extends CanvasEvent<TouchEvent> {}

/**
 * Object event type
 */
export interface CanvasObjectEvent extends CanvasEvent {
  target: FabricObject;
}

/**
 * Fabric.js event types
 */
export enum FabricEventType {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  OBJECT_MODIFIED = 'object:modified',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared'
}
