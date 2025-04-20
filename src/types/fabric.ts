
import { Canvas, Object as FabricObject } from 'fabric';

// Aliases for Fabric.js types
export type FabricCanvas = Canvas;
export type FabricObject = FabricObject;
export type FabricLine = fabric.Line;
export type FabricCircle = fabric.Circle;
export type FabricRect = fabric.Rect;
export type FabricPath = fabric.Path;
export type FabricText = fabric.Text;
export type FabricGroup = fabric.Group;
export type FabricBrush = fabric.BaseBrush;
export type FabricPoint = fabric.Point;

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
}
