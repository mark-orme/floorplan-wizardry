
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Drawing tool type definition
 */
export type DrawingTool = string;

/**
 * Canvas state interface
 */
export interface CanvasState {
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showMeasurements: boolean;
}

/**
 * Default canvas state
 */
export const DEFAULT_CANVAS_STATE: CanvasState = {
  tool: DrawingMode.SELECT,
  lineColor: '#000000',
  lineThickness: 2,
  gridVisible: true,
  snapToGrid: false,
  gridSize: 20,
  showRulers: false,
  showMeasurements: false
};

/**
 * Extended properties for the canvas provider context
 */
export interface CanvasProviderState {
  state: CanvasState;
  setState: (state: Partial<CanvasState>) => void;
  resetState: () => void;
  isReady: boolean;
}
