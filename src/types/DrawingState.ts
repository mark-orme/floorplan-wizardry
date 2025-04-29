
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from './Point';

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  distance?: number;
  cursorPosition?: Point | null;
  // Additional fields for drawing tools
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  pathStartPoint?: Point | null;
  currentPath?: any;
  zoomLevel?: number;
}

export function createDefaultDrawingState(): DrawingState {
  return {
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    points: [],
    distance: 0,
    cursorPosition: null,
    tool: DrawingMode.SELECT,
    lineColor: '#000000',
    lineThickness: 2,
    pathStartPoint: null,
    currentPath: null
  };
}
