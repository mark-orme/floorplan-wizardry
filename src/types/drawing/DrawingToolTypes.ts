
/**
 * Unified drawing tool type definitions
 * This file centralizes type definitions to resolve incompatibility issues
 * @module types/drawing/DrawingToolTypes
 */
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingTool, isValidDrawingTool } from "@/types/core/DrawingTool";

/**
 * Re-export DrawingMode as the canonical drawing tool type
 * This helps standardize usage across the application
 */
export type { DrawingTool };

/**
 * Re-export the DrawingMode enum directly
 * This ensures we have a single source of truth for drawing tools
 */
export { DrawingMode };

/**
 * Re-export the type guard from core/DrawingTool
 * Use this to validate DrawingTool values
 */
export { isValidDrawingTool };

/**
 * Convert a DrawingTool to DrawingMode safely
 * Use this function when transitioning between the two types
 * 
 * @param {DrawingTool} tool - Drawing tool to convert
 * @returns {DrawingMode} Equivalent DrawingMode
 */
export const toDrawingMode = (tool: DrawingTool): DrawingMode => {
  return tool;
};

/**
 * Default drawing tool
 * Use this as the default value for drawing tool state
 */
export const DEFAULT_DRAWING_TOOL: DrawingTool = DrawingMode.SELECT;
