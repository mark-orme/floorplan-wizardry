
/**
 * Fabric.js Event Type Definitions
 * 
 * This file contains TypeScript type definitions for Fabric.js event handling
 * to ensure consistent usage across the application.
 */

import { TPointerEvent } from 'fabric';

/**
 * Standard Fabric.js pointer event interface
 * Compatible with both Fabric.js v5 and v6
 */
export interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer?: { x: number; y: number };
  target?: any;
  absolutePointer?: { x: number; y: number };
  transform?: any;
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
  e: Event;
  target: any;
  transform?: any;
}

/**
 * Event for fabric canvas object:selected
 */
export interface FabricObjectSelectedEvent {
  e: Event;
  target: any;
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
 */
export enum FabricEventTypes {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_SELECTED = 'object:selected',
  SELECTION_CREATED = 'selection:created',
  SELECTION_CLEARED = 'selection:cleared'
}
