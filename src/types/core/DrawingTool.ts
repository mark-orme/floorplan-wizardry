
/**
 * Core drawing tool types
 * @module types/core/DrawingTool
 */
import type { DrawingMode } from '@/constants/drawingModes';

/**
 * DrawingTool type - The canonical type to use for all drawing tools
 * This is the primary source of truth for drawing tool types
 * Directly uses DrawingMode enum values for better type safety
 */
export type DrawingTool = DrawingMode;

/**
 * Type guard to check if a value is a valid DrawingTool
 * @param value - The value to check
 * @returns Whether the value is a valid DrawingTool
 */
export function isValidDrawingTool(value: unknown): value is DrawingTool {
  return typeof value === 'string' && 
         Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Get a user-friendly display name for a DrawingTool
 * @param tool - The drawing tool
 * @returns A formatted display name for the tool
 */
export function getToolDisplayName(tool: DrawingTool): string {
  const formatted = tool.replace(/-/g, ' ');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
