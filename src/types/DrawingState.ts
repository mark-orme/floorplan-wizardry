
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';

export interface DrawingState {
  isDrawing: boolean;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  startPoint?: Point;
  currentPoint?: Point;
  distance?: number;
  cursorPosition?: Point;
  isSnapping?: boolean;
  snapPoint?: Point;
}

export interface DrawingObject {
  id: string;
  type: string;
  points?: Point[];
  path?: any[];
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  metadata?: Record<string, any>;
}
