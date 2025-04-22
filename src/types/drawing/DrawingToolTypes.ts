
import { DrawingMode } from "@/constants/drawingModes";

export type DrawingTool = DrawingMode;

export { DrawingMode };

export function isValidDrawingTool(value: any): value is DrawingTool {
  return Object.values(DrawingMode).includes(value as DrawingMode);
}

export const toDrawingMode = (tool: DrawingTool): DrawingMode => {
  return tool;
};

export const DEFAULT_DRAWING_TOOL: DrawingTool = DrawingMode.SELECT;
