
/**
 * Gesture Types
 * Type definitions for touch gesture handling
 */
import { Point } from '@/utils/geometry/Point';

export interface TouchPoint {
  id: number;
  position: Point;
  startPosition: Point;
  identifier: number;
}

export interface GestureStateObject {
  active: boolean;
  touchCount: number;
  scale: number;
  rotation: number;
  translateX: number;
  translateY: number;
  startPoints: TouchPoint[]; // Add this property
  currentPoints: TouchPoint[];
  initialDistance?: number;
  currentDistance?: number;
  initialAngle?: number;
  currentAngle?: number;
  type?: 'pan' | 'pinch' | 'rotate' | 'tap' | 'none';
}

export type GestureHandler = (state: GestureStateObject) => void;

export interface GestureOptions {
  minPointers?: number;
  maxPointers?: number;
  cancelsTouchesInView?: boolean;
  enablePan?: boolean;
  enablePinch?: boolean;
  enableRotation?: boolean;
  onGestureStart?: GestureHandler;
  onGestureChange?: GestureHandler;
  onGestureEnd?: GestureHandler;
  onPan?: GestureHandler;
  onPinch?: GestureHandler;
  onRotate?: GestureHandler;
}

export interface GestureResult {
  start: () => void;
  stop: () => void;
  update: (event: TouchEvent | MouseEvent) => void;
  gestureState: GestureStateObject;
}
