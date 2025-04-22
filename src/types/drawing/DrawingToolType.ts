
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Canonical DrawingTool type is DrawingMode (alias)
 */
export type DrawingTool = DrawingMode;

/**
 * Type guard to check if a value is a valid DrawingTool/DrawingMode
 */
export function isValidDrawingTool(value: any): value is DrawingTool {
  return Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Compare DrawingTool and DrawingMode values
 */
export function compareDrawingTools(tool1: DrawingTool, tool2: DrawingMode): boolean {
  return String(tool1) === String(tool2);
}
export { DrawingMode };
