
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Fabric Pointer Event interface
 * Represents pointer events in Fabric.js
 */
export interface FabricPointerEvent {
  e?: Event;
  target?: FabricObject;
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
  subTargets?: FabricObject[];
  transform?: {
    corner: string;
    original: FabricObject;
    originX: string;
    originY: string;
    width: number;
  };
  movementX?: number;
  movementY?: number;
}
