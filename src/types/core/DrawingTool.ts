
/**
 * Core drawing tool types
 * Provides the canonical source of truth for drawing tools in the application
 * @module types/core/DrawingTool
 */
import { DrawingMode } from '@/constants/drawingModes';

/**
 * DrawingTool type - The canonical type to use for all drawing tools
 * This is the primary source of truth for drawing tool types
 * Directly uses DrawingMode enum values for better type safety
 * 
 * @typedef {DrawingMode} DrawingTool
 */
export type DrawingTool = DrawingMode;

/**
 * Type guard to check if a value is a valid DrawingTool
 * 
 * @param {unknown} value - The value to check
 * @returns {boolean} Whether the value is a valid DrawingTool
 */
export function isValidDrawingTool(value: unknown): value is DrawingTool {
  return typeof value === 'string' && 
         Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Get a user-friendly display name for a DrawingTool
 * 
 * @param {DrawingTool} tool - The drawing tool
 * @returns {string} A formatted display name for the tool
 */
export function getToolDisplayName(tool: DrawingTool): string {
  const formatted = tool.replace(/-/g, ' ');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Convert a string to a DrawingTool if valid
 * 
 * @param {string} value - The string value to convert
 * @returns {DrawingTool | null} The DrawingTool if valid, null otherwise
 */
export function parseDrawingTool(value: string): DrawingTool | null {
  return isValidDrawingTool(value) ? value : null;
}

/**
 * Get the default drawing tool
 * 
 * @returns {DrawingTool} The default drawing tool
 */
export function getDefaultDrawingTool(): DrawingTool {
  return DrawingMode.SELECT;
}
