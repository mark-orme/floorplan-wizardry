
import { fabric } from 'fabric';

/**
 * Fabric Pointer Event interface
 * Represents pointer events in Fabric.js
 */
export interface FabricPointerEvent {
  e?: Event;
  target?: fabric.Object;
  pointer?: {
    x: number;
    y: number;
  };
  absolutePointer?: {
    x: number;
    y: number;
  };
  button?: number;
  isClick?: boolean;
  subTargets?: fabric.Object[];
  transform?: {
    corner: string;
    original: fabric.Object;
    originX: string;
    originY: string;
    width: number;
  };
  movementX?: number;
  movementY?: number;
}
