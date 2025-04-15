
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
