
import { DrawingMode } from '@/constants/drawingModes';

export type DrawingTool = 'select' | 'pan' | 'draw' | 'erase' | 'line' | 'rectangle' | 'circle' | 'text' | 'wall';

export interface CanvasState {
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  showGrid: boolean;
  snapToGrid: boolean;
  zoom: number;
}

export const DEFAULT_CANVAS_STATE: CanvasState = {
  tool: DrawingMode.SELECT,
  lineColor: '#000000',
  lineThickness: 2,
  showGrid: true,
  snapToGrid: false,
  zoom: 1
};

export interface DrawingState {
  isDrawing: boolean;
  tool: DrawingMode;
  pathStartPoint: { x: number, y: number };
  lineColor: string;
  lineThickness: number;
  currentPath: any;
  startPoint: { x: number, y: number };
  currentPoint: { x: number, y: number };
  points: { x: number, y: number }[];
  distance: number;
  cursorPosition: { x: number, y: number };
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
