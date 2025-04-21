
/**
 * DrawingTool Type Definition
 * 
 * This module defines the DrawingTool type which is used throughout the application
 * to represent various drawing tools and modes.
 * 
 * @module types/core/DrawingTool
 */

import { DrawingMode } from '@/constants/drawingModes';

/**
 * DrawingTool is the canonical type for drawing tools/modes in the application.
 * It is an alias to the DrawingMode enum from constants/drawingModes.
 * 
 * Always import DrawingMode from '@/constants/drawingModes' when using DrawingTool.
 */
export type DrawingTool = DrawingMode;

/**
 * Type guard to check if a value is a valid DrawingTool
 * 
 * @param value - The value to check
 * @returns True if the value is a valid DrawingTool
 * 
 * @example
 * ```typescript
 * if (isValidDrawingTool(userInput)) {
 *   // TypeScript now knows userInput is a DrawingTool
 *   activateTool(userInput);
 * }
 * ```
 */
export function isValidDrawingTool(value: unknown): value is DrawingTool {
  return typeof value === 'string' && Object.values(DrawingMode).includes(value as DrawingMode);
}

/**
 * Get display name for a drawing tool
 * 
 * @param tool - The drawing tool
 * @returns User-friendly display name for the tool
 * 
 * @example
 * ```typescript
 * const displayName = getToolDisplayName(DrawingMode.RECTANGLE); // "Rectangle"
 * ```
 */
export function getToolDisplayName(tool: DrawingTool): string {
  const displayNames: Record<DrawingTool, string> = {
    [DrawingMode.SELECT]: 'Select',
    [DrawingMode.DRAW]: 'Draw',
    [DrawingMode.LINE]: 'Line',
    [DrawingMode.STRAIGHT_LINE]: 'Straight Line',
    [DrawingMode.RECTANGLE]: 'Rectangle',
    [DrawingMode.CIRCLE]: 'Circle',
    [DrawingMode.TEXT]: 'Text',
    [DrawingMode.PAN]: 'Pan',
    [DrawingMode.HAND]: 'Hand',
    [DrawingMode.ZOOM]: 'Zoom',
    [DrawingMode.ERASE]: 'Erase',
    [DrawingMode.ERASER]: 'Eraser',
    [DrawingMode.MEASURE]: 'Measure',
    [DrawingMode.WALL]: 'Wall',
    [DrawingMode.DOOR]: 'Door',
    [DrawingMode.WINDOW]: 'Window',
    [DrawingMode.ROOM]: 'Room',
    [DrawingMode.ROOM_LABEL]: 'Room Label',
    [DrawingMode.PENCIL]: 'Pencil',
    [DrawingMode.SHAPE]: 'Shape',
    [DrawingMode.COLUMN]: 'Column',
    [DrawingMode.DIMENSION]: 'Dimension',
    [DrawingMode.STAIR]: 'Stair'
  };
  
  return displayNames[tool] || tool.charAt(0).toUpperCase() + tool.slice(1).replace(/([A-Z])/g, ' $1');
}
