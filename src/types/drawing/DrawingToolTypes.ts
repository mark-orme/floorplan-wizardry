
/**
 * Unified drawing tool type definitions
 * This file centralizes type definitions to resolve incompatibility issues
 * @module types/drawing/DrawingToolTypes
 */
import { DrawingMode } from "@/constants/drawingModes";

/**
 * Re-export DrawingMode as the canonical drawing tool type
 * This helps standardize usage across the application
 */
export type DrawingTool = DrawingMode;

/**
 * Re-export the DrawingMode enum directly
 * This ensures we have a single source of truth for drawing tools
 */
export { DrawingMode };

/**
 * Type guard to check if a value is a valid DrawingMode
 * @param value - Value to check
 * @returns Whether the value is a valid DrawingMode
 */
export const isValidDrawingMode = (value: unknown): value is DrawingMode => {
  return typeof value === 'string' && Object.values(DrawingMode).includes(value as DrawingMode);
};

/**
 * Convert a DrawingTool to DrawingMode safely
 * Use this function when transitioning between the two types
 * @param tool - Drawing tool to convert
 * @returns Equivalent DrawingMode
 */
export const toDrawingMode = (tool: DrawingTool): DrawingMode => {
  return tool as unknown as DrawingMode;
};

/**
 * Default drawing tool
 * Use this as the default value for drawing tool state
 */
export const DEFAULT_DRAWING_TOOL = DrawingMode.SELECT;
