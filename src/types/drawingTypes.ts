
import { Point } from './core/Point';

/**
 * Gesture types enumeration
 */
export type GestureType = 'pinch' | 'pan' | 'rotate' | 'tap';

/**
 * Gesture state interface
 */
export interface GestureStateObject {
  type: GestureType;
  startPoints: Point[];
  currentPoints: Point[];
  scale: number;
  rotation: number;
  translation: Point;
  center: Point;
}

/**
 * Gesture state type
 */
export type GestureState = GestureStateObject;
