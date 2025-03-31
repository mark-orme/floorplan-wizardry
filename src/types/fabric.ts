
/**
 * Type definitions for Fabric.js
 * Provides type aliases and interfaces for working with Fabric.js
 */

import { Canvas, Object, PencilBrush, Line, Point } from 'fabric';

/**
 * Canvas alias that can be used throughout the application
 * @type {Canvas} FabricCanvas - Alias for Fabric.js Canvas class
 */
export type FabricCanvas = Canvas;

/**
 * Object alias that can be used throughout the application
 * @type {Object} FabricObject - Alias for Fabric.js Object class
 */
export type FabricObject = Object;

/**
 * Brush alias that can be used throughout the application
 * @type {PencilBrush} FabricBrush - Alias for Fabric.js PencilBrush class
 */
export type FabricBrush = PencilBrush;

/**
 * Line alias that can be used throughout the application
 * @type {Line} FabricLine - Alias for Fabric.js Line class
 */
export type FabricLine = Line;

/**
 * Point alias that can be used throughout the application
 * @type {Point} FabricPoint - Alias for Fabric.js Point class
 */
export type FabricPoint = Point;

/**
 * Custom event types for Fabric.js
 * These help with type safety when working with Fabric.js events
 */

/**
 * Extended Fabric object with additional properties
 * @interface FabricObjectWithId
 * @extends {FabricObject}
 */
export interface FabricObjectWithId extends FabricObject {
  /** Optional unique identifier for the object */
  id?: string;
  /** Flag indicating if this object is part of the grid system */
  isGrid?: boolean;
  /** Type identifier for specialized object categorization */
  objectType?: string;
}

/**
 * Custom mouse event interface for Fabric.js
 * @interface CustomFabricMouseEvent
 */
export interface CustomFabricMouseEvent {
  /** Original DOM event (MouseEvent or TouchEvent) */
  e: MouseEvent | TouchEvent;
  /** Current pointer coordinates relative to canvas */
  pointer: { x: number; y: number };
  /** Object under the pointer, if any */
  target?: FabricObject;
}

/**
 * Extended TouchEvent with additional properties
 * @interface CustomTouchEvent
 * @extends {TouchEvent}
 */
export interface CustomTouchEvent extends TouchEvent {
  /** X-coordinate of touch point relative to client area */
  clientX?: number;
  /** Y-coordinate of touch point relative to client area */
  clientY?: number;
}

/**
 * Fabric-specific pointer event format
 * @interface FabricPointerEvent
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
 * @interface CanvasReferences
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

/**
 * Type guard to check if an event is a touch event
 * Used to safely handle both mouse and touch interactions
 * 
 * @param {unknown} event - The event to check
 * @returns {boolean} True if the event is a touch event
 */
export const isTouchEvent = (event: unknown): event is TouchEvent => {
  return Boolean(
    event && 
    typeof event === 'object' && 
    'touches' in event && 
    'changedTouches' in event
  );
};

/**
 * Type guard to check if an event is a mouse event
 * Used to safely differentiate between mouse and touch events
 * 
 * @param {unknown} event - The event to check
 * @returns {boolean} True if the event is a mouse event
 */
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
