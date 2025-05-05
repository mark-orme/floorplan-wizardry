
/**
 * Gesture types for multi-touch interaction
 */

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  force?: number;
  radiusX?: number;
  radiusY?: number;
  rotationAngle?: number;
}

export interface GesturePoint {
  x: number;
  y: number;
}

export interface GestureStateObject {
  active: boolean;
  touches: TouchPoint[];
  startDistance?: number;
  currentDistance?: number;
  startScale?: number;
  currentScale?: number;
  startRotation?: number;
  currentRotation?: number;
  startCenter?: GesturePoint;
  currentCenter?: GesturePoint;
  startPoints?: GesturePoint[]; // Add missing property
  delta?: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
  initialEvent?: TouchEvent;
}

export enum GestureType {
  NONE = 'none',
  PAN = 'pan',
  PINCH = 'pinch',
  ROTATE = 'rotate',
  TAP = 'tap',
  DOUBLE_TAP = 'doubleTap',
  LONG_PRESS = 'longPress'
}

export interface GestureHandlers {
  onPanStart?: (e: TouchEvent, state: GestureStateObject) => void;
  onPan?: (e: TouchEvent, state: GestureStateObject) => void;
  onPanEnd?: (e: TouchEvent, state: GestureStateObject) => void;
  onPinchStart?: (e: TouchEvent, state: GestureStateObject) => void;
  onPinch?: (e: TouchEvent, state: GestureStateObject) => void;
  onPinchEnd?: (e: TouchEvent, state: GestureStateObject) => void;
  onRotateStart?: (e: TouchEvent, state: GestureStateObject) => void;
  onRotate?: (e: TouchEvent, state: GestureStateObject) => void;
  onRotateEnd?: (e: TouchEvent, state: GestureStateObject) => void;
  onTap?: (e: TouchEvent, state: GestureStateObject) => void;
  onDoubleTap?: (e: TouchEvent, state: GestureStateObject) => void;
  onLongPress?: (e: TouchEvent, state: GestureStateObject) => void;
}

export interface GestureOptions {
  minDistance?: number;
  minScale?: number;
  minRotation?: number;
  tapTimeout?: number;
  doubleTapTimeout?: number;
  longPressTimeout?: number;
  enablePan?: boolean;
  enablePinch?: boolean;
  enableRotate?: boolean;
  enableTap?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
}
