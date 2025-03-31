
/**
 * Type definitions for Fabric.js
 * Provides type aliases and interfaces for working with Fabric.js
 */

import { Canvas, Object, PencilBrush, Line, Point } from 'fabric';

// Canvas alias that can be used throughout the application
export type FabricCanvas = Canvas;

// Object alias that can be used throughout the application
export type FabricObject = Object;

// Brush alias that can be used throughout the application
export type FabricBrush = PencilBrush;

// Line alias that can be used throughout the application
export type FabricLine = Line;

// Point alias that can be used throughout the application
export type FabricPoint = Point;

/**
 * Custom event types for Fabric.js
 * These help with type safety when working with Fabric.js events
 */
export interface FabricObjectWithId extends FabricObject {
  id?: string;
  isGrid?: boolean;
  objectType?: string;
}

/**
 * Custom touch event interface for Fabric.js
 */
export interface CustomFabricTouchEvent {
  e: TouchEvent;
  pointer: { x: number; y: number };
  target?: FabricObject;
}

/**
 * Custom mouse event interface for Fabric.js
 */
export interface CustomFabricMouseEvent {
  e: MouseEvent | TouchEvent;
  pointer: { x: number; y: number };
  target?: FabricObject;
}

/**
 * Extended TouchEvent with additional properties
 */
export interface CustomTouchEvent extends TouchEvent {
  /** X-coordinate of touch point relative to client area */
  clientX?: number;
  /** Y-coordinate of touch point relative to client area */
  clientY?: number;
}

/**
 * Fabric-specific pointer event format
 */
export interface FabricPointerEvent {
  /** Original DOM event (MouseEvent or TouchEvent) */
  e: MouseEvent | TouchEvent;
  /** Current pointer coordinates relative to canvas */
  pointer: { x: number; y: number };
  /** Absolute pointer coordinates (accounting for canvas transform) */
  absolutePointer?: { x: number; y: number };
  /** Coordinates in the scene coordinate system (Fabric v6 nomenclature) */
  scenePoint?: { x: number; y: number };
  /** Coordinates in the viewport coordinate system (Fabric v6 nomenclature) */
  viewportPoint?: { x: number; y: number };
  /** Object under the pointer, if any */
  target?: any; 
  /** Whether this event represents a click */
  isClick?: boolean;
  /** Current subtargets for event bubbling */
  currentSubTargets?: any[];
}

/**
 * Centralized references to canvas elements and instances
 * Used to maintain consistent access throughout the application
 */
export interface CanvasReferences {
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Reference to the Fabric.js canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Direct access to Fabric.js canvas instance */
  canvas?: FabricCanvas | null;
  /** Reference to HTML canvas element for direct DOM operations */
  canvasElement?: HTMLCanvasElement | null;
  /** Reference to the container element that holds the canvas */
  container?: HTMLElement | null;
}

// Type guards for event handling
export const isTouchEvent = (event: unknown): event is TouchEvent => {
  return Boolean(
    event && 
    typeof event === 'object' && 
    'touches' in event && 
    'changedTouches' in event
  );
};

export const isMouseEvent = (event: unknown): event is MouseEvent => {
  return Boolean(
    event && 
    typeof event === 'object' && 
    'clientX' in event &&
    'clientY' in event &&
    !('touches' in event)
  );
};

// Export event types for ease of use
export { Canvas, Object, PencilBrush, Line, Point };
