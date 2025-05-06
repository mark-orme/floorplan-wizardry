
/**
 * Core type definitions for Fabric.js
 * This file serves as the central type definition for Fabric.js
 * to ensure consistency across the application
 */
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Extended Fabric canvas interface with additional properties
 * that Fabric.js has but TypeScript definitions might be missing
 */
export interface ExtendedFabricCanvas extends Canvas {
  // Properties
  isDrawingMode: boolean;
  selection: boolean;
  defaultCursor: string;
  hoverCursor: string;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  wrapperEl: HTMLDivElement;
  upperCanvasEl: HTMLCanvasElement;
  viewportTransform: number[];
  renderOnAddRemove: boolean;
  skipTargetFind: boolean;
  allowTouchScrolling: boolean;
  absolutePointer: { x: number; y: number };
  relativePointer: { x: number; y: number };
  
  // Methods
  getActiveObject(): FabricObject | null;
  getObjects(): FabricObject[];
  add(...objects: FabricObject[]): Canvas;
  remove(...objects: FabricObject[]): Canvas;
  forEachObject(callback: (obj: FabricObject) => void): void;
  zoomToPoint(point: { x: number; y: number }, value: number): Canvas;
  requestRenderAll(): Canvas;
  renderAll(): Canvas;
  getPointer(e: Event): { x: number; y: number };
}

/**
 * Extended Fabric object interface with additional properties
 */
export interface ExtendedFabricObject extends FabricObject {
  id?: string;
  objectType?: string;
  visible: boolean;
  selectable: boolean;
  evented: boolean;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  set(options: Record<string, any>): this;
  setCoords(): this;
}

/**
 * Performance metrics for canvas rendering
 */
export interface CanvasPerformanceMetrics {
  fps?: number;
  objectCount?: number;
  visibleObjectCount?: number;
  lastRenderTime?: number;
}

/**
 * Helper function to cast a Fabric canvas to ExtendedFabricCanvas
 */
export function asExtendedCanvas(canvas: Canvas | null): ExtendedFabricCanvas | null {
  return canvas as ExtendedFabricCanvas | null;
}

/**
 * Helper function to cast a Fabric object to ExtendedFabricObject
 */
export function asExtendedObject<T extends FabricObject>(obj: FabricObject): T & ExtendedFabricObject {
  return obj as T & ExtendedFabricObject;
}

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
  pointer?: { x: number; y: number };
  absolutePointer?: { x: number; y: number };
}
