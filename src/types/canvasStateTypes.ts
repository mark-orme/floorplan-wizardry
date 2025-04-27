
import { DrawingMode } from '@/constants/drawingModes';

export type DrawingTool = DrawingMode;

export interface ToolState {
  active: DrawingTool;
  previous: DrawingTool;
  lineColor: string;
  lineThickness: number;
  fillColor: string;
  opacity: number;
}

/**
 * Interface for canvas state hook result
 */
export interface UseCanvasStateResult {
  /** Current tool state */
  toolState: ToolState;
  /** Set active tool */
  setActiveTool: (tool: DrawingTool) => void;
  /** Set line color */
  setLineColor: (color: string) => void;
  /** Set line thickness */
  setLineThickness: (thickness: number) => void;
  /** Set fill color */
  setFillColor: (color: string) => void;
  /** Set opacity */
  setOpacity: (opacity: number) => void;
  /** Reset tool state */
  resetToolState: () => void;
}
