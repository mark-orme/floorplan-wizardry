
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Canvas state interface
 */
export interface CanvasState {
  width: number;
  height: number;
  zoom: number;
  tool: string;
  isDrawing: boolean;
  showGrid: boolean;
  showRulers: boolean;
  snap: boolean;
}

/**
 * Default canvas state
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  width: 800,
  height: 600,
  zoom: 1,
  tool: 'select',
  isDrawing: false,
  showGrid: true,
  showRulers: false,
  snap: true
};
