
/**
 * Common types for drawing operations
 */

// Simple point interface for coordinates
export interface Point {
  x: number;
  y: number;
}

// Drawing tool types
export enum DrawingTool {
  SELECT = 'select',
  DRAW = 'draw',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  POLYGON = 'polygon',
  TEXT = 'text',
  ERASER = 'eraser',
  HAND = 'hand'
}

// Direction for zoom operations
export type ZoomDirection = 'in' | 'out';

// Gesture types
export enum GestureType {
  PINCH = 'pinch',
  ROTATE = 'rotate',
  PAN = 'pan',
  TAP = 'tap',
  DOUBLETAP = 'doubletap',
  TWOFINGERTAP = 'twofingertap',
  THREEFINGERTAP = 'threefingertap',
  FOURFINGERTAP = 'fourfingertap'
}

// Gesture state
export interface GestureState {
  type: GestureType;
  center: Point;
  scale?: number;
  rotation?: number;
  velocity?: number;
  distance?: number;
  fingers?: number;
}
