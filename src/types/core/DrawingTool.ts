
/**
 * Drawing Tool type definitions
 * Defines the central type for drawing tools across the application
 * @module types/core/DrawingTool
 */

import { DrawingMode } from '@/constants/drawingModes';

/**
 * DrawingTool type
 * Uses DrawingMode enum for consistency and type safety
 */
export type DrawingTool = keyof typeof DrawingMode | DrawingMode;

/**
 * Validates if a value is a valid DrawingTool
 * 
 * @param {unknown} value - Value to validate
 * @returns {boolean} Whether the value is a valid DrawingTool
 */
export function isValidDrawingTool(value: unknown): value is DrawingTool {
  if (typeof value !== 'string') return false;
  return Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Gets a display name for a drawing tool
 * 
 * @param {DrawingTool} tool - Tool to get display name for
 * @returns {string} Display name for the tool
 */
export function getToolDisplayName(tool: DrawingTool): string {
  const toolString = String(tool);
  return toolString
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Parses a string into a DrawingTool
 * 
 * @param {string} value - String to parse
 * @returns {DrawingTool} Parsed DrawingTool, or SELECT if invalid
 */
export function parseDrawingTool(value: string): DrawingTool {
  if (isValidDrawingTool(value)) {
    return value;
  }
  return DrawingMode.SELECT; // Default to SELECT
}

/**
 * Gets the default drawing tool
 * 
 * @returns {DrawingTool} Default drawing tool (SELECT)
 */
export function getDefaultDrawingTool(): DrawingTool {
  return DrawingMode.SELECT;
}
