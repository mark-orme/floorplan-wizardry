
import type { Point } from './core/Point';

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  distance: number | null;
  cursorPosition: Point | null;
  currentZoom: number;
}

export enum ZoomDirection {
  IN = 'in',
  OUT = 'out'
}

export interface DebugInfoState {
  fps?: number;
  canvasReady?: boolean;
  canvasInitialized?: boolean;
  canvasCreated?: boolean;
  dimensionsSet?: boolean;
  brushInitialized?: boolean;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

// Add the missing gesture types
export type GestureType = 'pinch' | 'rotate' | 'pan';
export type GestureState = 'start' | 'move' | 'end';

// Add function to create default drawing state
export function createDefaultDrawingState(): DrawingState {
  return { isDrawing: false, startPoint: {x:0,y:0}, currentPoint: {x:0,y:0}, points: [], distance:0, cursorPosition:{x:0,y:0}, currentZoom: 1 };
}
