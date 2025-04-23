
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
