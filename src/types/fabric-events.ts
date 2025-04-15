
/**
 * Fabric.js Event Type Definitions
 * 
 * This file contains TypeScript type definitions for Fabric.js event handling
 * to ensure consistent usage across the application.
 * 
 * @module types/fabric-events
 */

import { Point as FabricPoint } from 'fabric';

/**
 * Fabric.js event names
 */
export enum FabricEventNames {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  OBJECT_ADDED = 'object:added',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_REMOVED = 'object:removed',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',
  PATH_CREATED = 'path:created'
}

/**
 * Fabric.js event types - alternative name for FabricEventNames for improved readability
 */
export const FabricEventTypes = FabricEventNames;

/**
 * Fabric.js pointer event info
 */
export interface TPointerEventInfo<T> {
  e: T;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  button?: number;
  target?: unknown;
  viewportPoint?: { x: number; y: number };
  scenePoint?: { x: number; y: number };
}

/**
 * Pointer event type
 */
export type TPointerEvent = MouseEvent | TouchEvent;

/**
 * Extended Fabric pointer event
 */
export interface FabricPointerEvent {
  e: MouseEvent | TouchEvent;
  pointer?: { x: number; y: number };
  absolutePointer?: { x: number; y: number };
  target?: unknown;
  viewportPoint?: { x: number; y: number };
  scenePoint?: { x: number; y: number };
  isClick?: boolean;
  currentSubTargets?: any[];
}

/**
 * Standard Fabric.js pointer event interface
 * Compatible with both Fabric.js v5 and v6
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
