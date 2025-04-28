
/**
 * Drawing state types for canvas interactions
 */

export interface Point {
  x: number;
  y: number;
}

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point;
  currentPoint: Point;
  points: Point[];
  distance: number;
  cursorPosition: Point;
}

export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    points: [],
    distance: 0,
    cursorPosition: { x: 0, y: 0 }
  };
}

export type DrawingMode = 'select' | 'draw' | 'line' | 'rectangle' | 'circle' | 'eraser';
