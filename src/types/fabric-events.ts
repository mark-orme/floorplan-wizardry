
/**
 * Fabric Events Type Definitions
 * Type definitions for Fabric.js events
 * @module types/fabric-events
 */
import { Object as FabricObject } from 'fabric';

export type TPointerEvent = MouseEvent | TouchEvent;

export interface TPointerEventInfo<E extends TPointerEvent> {
  e: E;
  pointer: { x: number; y: number };
  absolutePointer: { x: number; y: number };
  viewportPoint?: { x: number; y: number };
}

export interface TSelectionEventInfo<E extends TPointerEvent> extends TPointerEventInfo<E> {
  isClick: boolean;
  currentTarget: FabricObject;
  currentSubTargets?: FabricObject[];
}

export interface TMouseEventInfo extends TPointerEventInfo<MouseEvent> {
  transform?: any;
  button?: number;
}

export interface TDragEventInfo extends TMouseEventInfo {
  target?: FabricObject;
  currentTarget?: FabricObject;
}

export interface TSelectionEventInfo extends TSelectionEventInfo<MouseEvent> {
  selected?: FabricObject[];
  deselected?: FabricObject[];
  updated?: FabricObject[];
}

export enum FabricEventNames {
  // Mouse events
  MOUSE_DOWN = 'mouse:down',
  MOUSE_MOVE = 'mouse:move',
  MOUSE_UP = 'mouse:up',
  MOUSE_WHEEL = 'mouse:wheel',
  MOUSE_OVER = 'mouse:over',
  MOUSE_OUT = 'mouse:out',
  MOUSE_DBL_CLICK = 'mouse:dblclick',

  // Object events
  OBJECT_ADDED = 'object:added',
  OBJECT_REMOVED = 'object:removed',
  OBJECT_MODIFIED = 'object:modified',
  OBJECT_ROTATED = 'object:rotated',
  OBJECT_SCALED = 'object:scaled',
  OBJECT_MOVED = 'object:moved',
  OBJECT_MOVING = 'object:moving',

  // Selection events
  SELECTION_CREATED = 'selection:created',
  SELECTION_UPDATED = 'selection:updated',
  SELECTION_CLEARED = 'selection:cleared',

  // Canvas events
  AFTER_RENDER = 'after:render',
  BEFORE_RENDER = 'before:render',
  CANVAS_CLEARED = 'canvas:cleared',
  
  // Path events
  PATH_CREATED = 'path:created',
  
  // Custom keyboard events
  KEY_DOWN = 'key:down',
  KEY_UP = 'key:up'
}

// Export FabricEventNames as FabricEventTypes for backward compatibility
export const FabricEventTypes = FabricEventNames;
