
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
  SELECTION_CLEARED = 'selection:cleared'
}

/**
 * Fabric.js pointer event info
 */
export interface TPointerEventInfo<T> {
  e: T;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  button?: number;
  target?: unknown;
}

/**
 * Pointer event type
 */
export type TPointerEvent = MouseEvent | TouchEvent;
