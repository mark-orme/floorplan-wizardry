
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Adapter utilities to ensure type compatibility between DrawingMode and DrawingTool
 */

/**
 * Helper function to adapt DrawingMode to DrawingTool
 */
export const asDrawingTool = (mode: DrawingMode): DrawingTool => {
  return mode as unknown as DrawingTool;
};

/**
 * Helper function to adapt DrawingTool to DrawingMode 
 */
export const asDrawingMode = (tool: DrawingTool): DrawingMode => {
  return tool as unknown as DrawingMode;
};

/**
 * Compares a DrawingTool and a DrawingMode for equality
 */
export const isSameDrawingMode = (tool: DrawingTool, mode: DrawingMode): boolean => {
  return String(tool) === String(mode);
};

/**
 * Type guard to check if a value is a valid DrawingTool
 */
export const isDrawingTool = (value: any): value is DrawingTool => {
  if (typeof value === 'string') {
    return Object.values(DrawingMode).includes(value as DrawingMode);
  }
  return false;
};

/**
 * Ensure type compatibility in hooks/tests
 */
export const useDrawingToolAdapter = () => {
  return {
    asDrawingTool,
    asDrawingMode,
    isSameDrawingMode
  };
};
