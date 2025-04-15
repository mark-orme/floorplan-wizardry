/**
 * Drawing tool type definitions
 * @module types/core/DrawingTool
 */
import { DrawingMode } from "@/constants/drawingModes";

/**
 * DrawingTool type alias for DrawingMode
 * Represents the current drawing tool
 */
export type DrawingTool = DrawingMode;

/**
 * Check if a value is a valid drawing tool
 * @param {any} value - Value to check
 * @returns {boolean} True if valid drawing tool
 */
export function isValidDrawingTool(value: any): value is DrawingTool {
  return Object.values(DrawingMode).includes(value);
}

/**
 * Get display name for a drawing tool
 * @param {DrawingTool} tool - Drawing tool
 * @returns {string} Display name
 */
export function getToolDisplayName(tool: DrawingTool): string {
  const names: Partial<Record<DrawingMode, string>> = {
    [DrawingMode.SELECT]: 'Select',
    [DrawingMode.LINE]: 'Line',
    [DrawingMode.TEXT]: 'Text',
    [DrawingMode.STRAIGHT_LINE]: 'Straight Line',
    [DrawingMode.MEASURE]: 'Measure',
    [DrawingMode.ERASER]: 'Eraser'
  };
  
  return names[tool] || 'Unknown Tool';
}

/**
 * Parse a string to a drawing tool
 * @param {string} value - String value to parse
 * @returns {DrawingTool} Parsed drawing tool or default
 */
export function parseDrawingTool(value: string): DrawingTool {
  if (isValidDrawingTool(value)) {
    return value;
  }
  return getDefaultDrawingTool();
}

/**
 * Get default drawing tool
 * @returns {DrawingTool} Default drawing tool
 */
export function getDefaultDrawingTool(): DrawingTool {
  return DrawingMode.SELECT;
}

/**
 * Tool operation interface
 * Represents a drawing tool operation
 */
export interface ToolOperation {
  /** Tool identifier */
  tool: DrawingTool;
  /** Start drawing at a point */
  startDrawing: (x: number, y: number) => void;
  /** Continue drawing to a point */
  continueDrawing: (x: number, y: number) => void;
  /** End drawing at a point */
  endDrawing: (x: number, y: number) => void;
  /** Cancel the current drawing */
  cancelDrawing: () => void;
}

/**
 * Tool configuration interface
 * Represents configuration options for a drawing tool
 */
export interface ToolConfig {
  /** Line color */
  lineColor: string;
  /** Line thickness */
  lineThickness: number;
  /** Fill color (for shapes) */
  fillColor?: string;
  /** Whether shape is filled */
  filled?: boolean;
  /** Whether snapping to grid is enabled */
  snapToGrid?: boolean;
  /** Whether straightening is enabled */
  straighten?: boolean;
}
