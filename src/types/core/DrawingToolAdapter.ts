
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Helper function to ensure type compatibility between DrawingMode and DrawingTool
 * This allows us to use DrawingMode values where DrawingTool is expected
 */
export const asDrawingTool = (mode: DrawingMode): DrawingTool => {
  return mode as unknown as DrawingTool;
};

/**
 * Helper function to ensure type compatibility between DrawingTool and DrawingMode
 * This allows us to use DrawingTool values where DrawingMode is expected
 */
export const asDrawingMode = (tool: DrawingTool): DrawingMode => {
  return tool as unknown as DrawingMode;
};

/**
 * Helper function to check equality between DrawingTool and DrawingMode
 * This allows us to compare DrawingTool and DrawingMode values
 */
export const isSameTool = (tool: DrawingTool, mode: DrawingMode): boolean => {
  return String(tool) === String(mode);
};

/**
 * InputMethod enum values for use in code
 * This provides the actual enum values to use where InputMethod is needed
 */
export enum InputMethodEnum {
  MOUSE = 'mouse',
  PENCIL = 'pencil',
  TOUCH = 'touch',
  KEYBOARD = 'keyboard'
}
