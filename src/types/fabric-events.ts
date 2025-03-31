
/**
 * Types for Fabric.js events
 */

export enum FabricEventTypes {
  // Mouse events
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  MOUSE_OVER = 'mouse:over',
  MOUSE_OUT = 'mouse:out',
  MOUSE_WHEEL = 'mouse:wheel',
  
  // Object events
  OBJECT_ADDED = 'object:added',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_REMOVED = 'object:removed',
  OBJECT_ROTATING = 'object:rotating',
  OBJECT_SCALING = 'object:scaling',
  OBJECT_MOVING = 'object:moving',
  OBJECT_SELECTED = 'object:selected',
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',
  
  // Canvas events
  AFTER_RENDER = 'after:render',
  BEFORE_RENDER = 'before:render',
  CANVAS_CLEARED = 'canvas:cleared',
  ZOOM_CHANGE = 'zoom:change'
}

export type FabricEvent = {
  e: Event;
  target?: any;
  pointer?: { x: number; y: number };
  button?: number;
  transform?: {
    corner: string;
    original: any;
    originX: string;
    originY: string;
    width: number;
    height: number;
    target: any;
  };
};
