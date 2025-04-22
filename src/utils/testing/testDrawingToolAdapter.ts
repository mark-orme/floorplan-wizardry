
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Adapts DrawingMode to DrawingTool for testing purposes
 * This ensures compatibility between the two types in tests
 */
export const adaptDrawingModeTool = (mode: DrawingMode): DrawingTool => {
  return mode as unknown as DrawingTool;
};

/**
 * Adapts DrawingTool to DrawingMode for testing purposes
 */
export const adaptDrawingToolMode = (tool: DrawingTool): DrawingMode => {
  return tool as unknown as DrawingMode;
};

/**
 * Compares DrawingTool and DrawingMode values
 */
export const areDrawingToolsEqual = (
  tool1: DrawingTool | DrawingMode,
  tool2: DrawingTool | DrawingMode
): boolean => {
  return String(tool1) === String(tool2);
};

/**
 * Hook for test environments to provide drawing tool type conversion
 */
export const useTestDrawingToolAdapter = () => {
  return {
    adaptDrawingModeTool,
    adaptDrawingToolMode,
    areDrawingToolsEqual
  };
};
