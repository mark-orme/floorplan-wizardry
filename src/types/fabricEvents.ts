
import { Object as FabricObject } from 'fabric';
import { Point } from '@/types/core/Point';

export interface FabricCanvasMouseEvent {
  e: MouseEvent;
  target?: FabricObject;
  pointer: Point;
  absolutePointer: Point;
  button?: number;
}

export interface FabricCanvasObjectEvent {
  target: FabricObject;
  e?: Event;
}

export interface FabricObjectModifiedEvent {
  target: FabricObject;
  transform?: {
    original: FabricObject;
    corner: string;
    originX: string;
    originY: string;
    width: number;
  };
  action?: string;
  e?: Event;
}

export type FabricEventHandler<T = any> = (e: T) => void;

export const FabricEventNames = {
  MOUSE_DOWN: 'mouse:down',
  MOUSE_MOVE: 'mouse:move',
  MOUSE_UP: 'mouse:up',
  SELECTION_CREATED: 'selection:created',
  SELECTION_UPDATED: 'selection:updated',
  SELECTION_CLEARED: 'selection:cleared',
  OBJECT_ADDED: 'object:added',
  OBJECT_MODIFIED: 'object:modified',
  OBJECT_REMOVED: 'object:removed',
  AFTER_RENDER: 'after:render',
  BEFORE_RENDER: 'before:render',
  CANVAS_CLEARED: 'canvas:cleared',
};
