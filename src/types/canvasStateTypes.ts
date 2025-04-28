
import { DrawingMode } from '@/constants/drawingModes';

export type DrawingTool = 
  | 'select'
  | 'pan'
  | 'draw'
  | 'erase'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'wall';

export interface CanvasState {
  /** Current zoom */
  zoomLevel: number;
  /** UI overrides */
  lineColor: string;
  lineThickness: number;
  snapToGrid: boolean;
}
