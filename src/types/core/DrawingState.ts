
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from './Point';

export interface DrawingState {
  isDrawing: boolean;
  tool: DrawingMode;
  pathStartPoint: Point;
  lineColor: string;
  lineThickness: number;
  currentPath: any;
  startPoint: Point;
  currentPoint: Point;
  points: Point[];
  distance: number;
  cursorPosition: Point;
}

export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    tool: DrawingMode.SELECT,
    pathStartPoint: { x: 0, y: 0 },
    lineColor: '#000000',
    lineThickness: 2,
    currentPath: null,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    points: [],
    distance: 0,
    cursorPosition: { x: 0, y: 0 }
  };
}
