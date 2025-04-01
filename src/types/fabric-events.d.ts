
/**
 * Fabric.js Event Type Definitions
 * 
 * This file contains TypeScript type definitions for Fabric.js event handling
 * to ensure consistent usage across the application.
 * 
 * @module types/fabric-events
 */

import { TPointerEvent, Point as FabricPoint } from 'fabric';

/**
 * Standard Fabric.js pointer event interface
 * Compatible with both Fabric.js v5 and v6
 */
export interface FabricPointerEvent {
  /** Original DOM event */
  e: MouseEvent | TouchEvent;
  /** Current pointer coordinates */
  pointer?: { x: number; y: number };
  /** Object being targeted by event */
  target?: any;
  /** Absolute pointer coordinates */
  absolutePointer?: { x: number; y: number };
  /** Event transform information */
  transform?: any;
  /** Coordinates in scene space (Fabric v6) */
  scenePoint?: { x: number; y: number };
  /** Coordinates in viewport space (Fabric v6) */
  viewportPoint?: { x: number; y: number };
  /** Whether this event represents a click */
  isClick?: boolean;
  /** Current subtargets for event bubbling */
  currentSubTargets?: any[];
}

/**
 * Event for fabric canvas mouse:down
 */
export interface FabricMouseDownEvent extends FabricPointerEvent {}

/**
 * Event for fabric canvas mouse:move
 */
export interface FabricMouseMoveEvent extends FabricPointerEvent {}

/**
 * Event for fabric canvas mouse:up
 */
export interface FabricMouseUpEvent extends FabricPointerEvent {}

/**
 * Event for fabric canvas object:modified
 */
export interface FabricObjectModifiedEvent {
  /** Original DOM event */
  e: Event;
  /** Target object */
  target: any;
  /** Transform information */
  transform?: any;
}

/**
 * Event for fabric canvas object:selected
 */
export interface FabricObjectSelectedEvent {
  /** Original DOM event */
  e: Event;
  /** Target object */
  target: any;
  /** Selected objects */
  selected?: any[];
}

/**
 * Type for a Fabric.js event handler function
 */
export type FabricEventHandler<T> = (event: T) => void;

/**
 * Event handler for mouse:down events
 */
export type FabricMouseDownHandler = FabricEventHandler<FabricMouseDownEvent>;

/**
 * Event handler for mouse:move events
 */
export type FabricMouseMoveHandler = FabricEventHandler<FabricMouseMoveEvent>;

/**
 * Event handler for mouse:up events
 */
export type FabricMouseUpHandler = FabricEventHandler<FabricMouseUpEvent>;

/**
 * Type for extracting native event from Fabric event
 */
export type FabricNativeEvent = MouseEvent | TouchEvent;

/**
 * Common Fabric.js event types
 * Used to standardize event naming across the application
 */
export enum FabricEventTypes {
  /** Mouse down event */
  MOUSE_DOWN = 'mouse:down',
  /** Mouse move event */
  MOUSE_MOVE = 'mouse:move',
  /** Mouse up event */
  MOUSE_UP = 'mouse:up',
  /** Object modified event */
  OBJECT_MODIFIED = 'object:modified',
  /** Object selected event */
  OBJECT_SELECTED = 'object:selected',
  /** Selection created event */
  SELECTION_CREATED = 'selection:created',
  /** Selection cleared event */
  SELECTION_CLEARED = 'selection:cleared'
}

