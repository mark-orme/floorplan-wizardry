
/**
 * Drawing state types for canvas interactions
 */

export interface Point {
  x: number;
  y: number;
}

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  pathStartPoint: Point | null; 
  currentPoint: Point | null;
  points: Point[];
  distance: number | null;
  cursorPosition: Point | null;
  isEnabled: boolean;
  currentZoom: number;
}

export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    startPoint: null,
    pathStartPoint: null,
    currentPoint: null,
    points: [],
    distance: null,
    cursorPosition: null,
    isEnabled: true,
    currentZoom: 1
  };
}

export type DrawingMode = 'select' | 'draw' | 'line' | 'rectangle' | 'circle' | 'eraser';
