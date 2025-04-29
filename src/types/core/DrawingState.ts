
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from './Point';

export interface DrawingState {
  isDrawing: boolean;
  tool: DrawingMode;
  pathStartPoint: Point | null;
  lineColor: string;
  lineThickness: number;
  currentPath: any | null;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  distance: number;
  cursorPosition: Point | null;
  zoomLevel?: number;
}

export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    tool: DrawingMode.SELECT,
    pathStartPoint: null,
    lineColor: '#000000',
    lineThickness: 2,
    currentPath: null,
    startPoint: null,
    currentPoint: null,
    points: [],
    distance: 0,
    cursorPosition: null,
    zoomLevel: 1
  };
}
