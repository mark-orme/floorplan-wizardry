
/**
 * Fabric.js event type definitions
 * @module types/fabric-events
 */
import { Object as FabricObject } from "fabric";

/**
 * Fabric event names enum
 */
export enum FabricEventNames {
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  MOUSE_WHEEL = 'mouse:wheel',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',
  OBJECT_ADDED = 'object:added',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_REMOVED = 'object:removed'
}

/**
 * Pointer event information
 */
export interface TPointerEventInfo<T extends Event> {
  e: T;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  scenePoint: { x: number; y: number };
  viewportPoint: { x: number; y: number };
}

/**
 * Pointer event
 */
export type TPointerEvent = MouseEvent | TouchEvent | PointerEvent;

/**
 * Selection event information
 */
export interface TSelectionEventInfo {
  e: Event;
  selected: FabricObject[];
  deselected?: FabricObject[];
  target?: FabricObject;
}

/**
 * Object event information
 */
export interface TObjectEventInfo {
  e: Event;
  target: FabricObject;
  transform?: any;
}

/**
 * Basic fabric event
 */
export interface FabricEvent {
  e: Event;
  target?: any;
}
