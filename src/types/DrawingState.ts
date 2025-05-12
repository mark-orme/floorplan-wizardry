
import { Point } from './core/Point';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Simplified drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point;
  currentPoint: Point;
  points: Point[];
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  cursorPosition: Point;
}

/**
 * Create a default drawing state
 */
export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    points: [],
    cursorPosition: { x: 0, y: 0 }
  };
}

export default DrawingState;
