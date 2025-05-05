
import { Point } from './core/Point';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point;
  currentPoint: Point;
  points: Point[];
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  distance: number;
  cursorPosition: Point;
  currentZoom?: number;
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
    distance: 0,
    cursorPosition: { x: 0, y: 0 },
    currentZoom: 1
  };
}

export default DrawingState;
