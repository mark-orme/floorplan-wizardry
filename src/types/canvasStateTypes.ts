
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
