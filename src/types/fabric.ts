
/**
 * Comprehensive Fabric.js type definitions
 * @module types/fabric
 */
import { Canvas, Object as FabricObject, PencilBrush, Line } from 'fabric';
import { Point } from '@/types/core/Geometry';

/**
 * Type alias for Fabric.js Canvas
 */
export type FabricCanvas = Canvas;

/**
 * Type alias for Fabric.js Object
 */
export type { FabricObject };

/**
 * Type alias for Fabric.js PencilBrush
 */
export type FabricBrush = PencilBrush;

/**
 * Type alias for Fabric.js Line
 */
export interface FabricLine extends Line {
  objectType?: string;
  id?: string;
}

/**
 * Extended Fabric.js Object with custom properties
 */
export interface FabricObjectWithId extends FabricObject {
  id?: string;
  objectType?: string;
}

/**
 * Fabric.js Point interface
 */
export interface FabricPoint {
  x: number;
  y: number;
  clone?: () => FabricPoint;
}

/**
 * Canvas references interface for commonly used refs
 */
export interface CanvasReferences {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  canvas?: FabricCanvas | null;
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
  historyRef?: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
}

/**
 * Extended Fabric.js mouse event
 */
export interface CustomFabricMouseEvent {
  e: MouseEvent;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  button?: number;
  target?: unknown;
  viewportPoint?: { x: number; y: number };
  scenePoint?: { x: number; y: number };
}

/**
 * Custom touch event interface
 */
export interface CustomTouchEvent extends TouchEvent {
  clientX?: number;
  clientY?: number;
  pointerId?: number;
}

/**
 * Fabric.js pointer event interface
 */
export interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer?: { x: number; y: number };
  absolutePointer?: { x: number; y: number };
  target?: unknown;
  viewportPoint?: { x: number; y: number };
  scenePoint?: { x: number; y: number };
}

/**
 * Type guard to check if an event is a touch event
 */
export function isTouchEvent(event: Event): event is TouchEvent {
  return 'touches' in event;
}

/**
 * Type guard to check if an event is a mouse event
 */
export function isMouseEvent(event: Event): event is MouseEvent {
  return 'clientX' in event && !('touches' in event);
}
