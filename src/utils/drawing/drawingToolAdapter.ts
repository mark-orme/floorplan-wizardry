
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/floorPlanTypes';

/**
 * Convert any string value to a valid DrawingTool
 * @param value The value to convert
 * @returns A valid DrawingTool
 */
export function asDrawingTool(value: string | DrawingMode): DrawingTool {
  // Cast the value to DrawingTool with validation
  if (Object.values(DrawingMode).includes(value as DrawingMode)) {
    return value as DrawingTool;
  }
  
  // Default to select if not a valid tool
  return DrawingMode.SELECT;
}

/**
 * Check if a value is a valid DrawingTool
 * @param value The value to check
 * @returns True if the value is a valid DrawingTool
 */
export function isValidDrawingTool(value: any): value is DrawingTool {
  return Object.values(DrawingMode).includes(value as DrawingMode);
}
