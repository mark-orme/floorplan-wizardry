
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Drawing tool type
 */
export type DrawingTool = DrawingMode;

/**
 * Canvas state interface
 */
export interface CanvasState {
  width: number;
  height: number;
  zoom: number;
  tool: DrawingTool;
  isDrawing: boolean;
  showGrid: boolean;
  showRulers: boolean;
  snap: boolean;
  zoomLevel: number;
  lineColor: string;
  lineThickness: number;
  snapToGrid: boolean;
}

/**
 * Default canvas state
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  width: 800,
  height: 600,
  zoom: 1,
  zoomLevel: 1,
  tool: DrawingMode.SELECT,
  isDrawing: false,
  showGrid: true,
  showRulers: false,
  snap: true,
  lineColor: '#000000',
  lineThickness: 2,
  snapToGrid: true
};
