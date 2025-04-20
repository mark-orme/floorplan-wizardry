
import { Canvas, Object as FbObject } from 'fabric';

// Aliases for Fabric.js types
export type FabricCanvas = Canvas;
export type FabricObject = FbObject;

// Define interfaces for Fabric objects
export interface FabricLine {
  id?: string;
  calcLinePoints?: () => { x1: number, y1: number, x2: number, y2: number };
}

export interface FabricCircle {
  id?: string;
  radius?: number;
}

export interface FabricRect {
  id?: string;
  width?: number;
  height?: number;
}

export interface FabricPath {
  id?: string;
  path?: any[];
}

export interface FabricText {
  id?: string;
  text?: string;
}

export interface FabricGroup {
  id?: string;
  objects?: FabricObject[];
}

export interface FabricBrush {
  id?: string;
  color?: string;
  width?: number;
}

export interface FabricPoint {
  x: number;
  y: number;
}

// Define object with ID
export interface FabricObjectWithId extends FabricObject {
  id: string;
}

// Common event interfaces
export interface CustomFabricMouseEvent {
  e: MouseEvent;
  target?: FabricObject;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  button?: number;
}

export interface CustomTouchEvent {
  e: TouchEvent;
  target?: FabricObject;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
}

export type FabricPointerEvent = CustomFabricMouseEvent | CustomTouchEvent;

// Type guards for events
export function isTouchEvent(event: FabricPointerEvent): event is CustomTouchEvent {
  return 'touches' in event.e;
}

export function isMouseEvent(event: FabricPointerEvent): event is CustomFabricMouseEvent {
  return 'button' in event.e;
}

// Canvas references type
export interface CanvasReferences {
  canvas: FabricCanvas | null;
  fabricRef: React.MutableRefObject<FabricCanvas | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef?: React.MutableRefObject<any[]>;
}
