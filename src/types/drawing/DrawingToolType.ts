
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Unify DrawingTool and DrawingMode types
 * This is the canonical type definition to use throughout the application
 */

// Make DrawingTool compatible with DrawingMode
export type DrawingTool = DrawingMode;

/**
 * Type guard to check if a value is a valid DrawingTool/DrawingMode
 */
export function isValidDrawingTool(value: any): value is DrawingTool {
  return Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Convert DrawingMode to DrawingTool
 */
export function toDrawingTool(mode: DrawingMode): DrawingTool {
  return mode as DrawingTool;
}

/**
 * Convert DrawingTool to DrawingMode
 */
export function toDrawingMode(tool: DrawingTool): DrawingMode {
  return tool as DrawingMode;
}

/**
 * Compare DrawingTool and DrawingMode values
 */
export function compareDrawingTools(tool1: DrawingTool, tool2: DrawingMode): boolean {
  return String(tool1) === String(tool2);
}

// Re-export DrawingMode for convenience
export { DrawingMode };
