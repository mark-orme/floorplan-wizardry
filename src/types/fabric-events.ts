
/**
 * Constants for Fabric.js event types
 * Using string literal types to maintain compatibility with Fabric's APIs
 */

export const FabricEventTypes = {
  MOUSE_DOWN: 'mouse:down',
  MOUSE_MOVE: 'mouse:move',
  MOUSE_UP: 'mouse:up',
  SELECTION_CREATED: 'selection:created',
  SELECTION_UPDATED: 'selection:updated',
  SELECTION_CLEARED: 'selection:cleared',
  OBJECT_ADDED: 'object:added',
  OBJECT_MODIFIED: 'object:modified',
  OBJECT_REMOVED: 'object:removed',
  PATH_CREATED: 'path:created',
  CANVAS_CLEARED: 'canvas:cleared',
  ZOOM_CHANGED: 'zoom:change',
  VIEWPORT_TRANSFORM: 'viewport:transform',
} as const;

export type FabricEventType = typeof FabricEventTypes[keyof typeof FabricEventTypes];
