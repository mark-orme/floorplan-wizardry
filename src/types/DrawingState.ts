
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  modifiers: {
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
  };
}

export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    points: [],
    tool: DrawingMode.DRAW,
    lineColor: '#000000',
    lineThickness: 2,
    modifiers: {
      shiftKey: false,
      altKey: false,
      ctrlKey: false
    }
  };
}
