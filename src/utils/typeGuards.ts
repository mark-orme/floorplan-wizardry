
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Type guard to check if a value is a valid DrawingMode
 */
export const isDrawingMode = (value: any): value is DrawingMode => {
  return Object.values(DrawingMode).includes(value as DrawingMode);
};

/**
 * Type guard to check if a value is a valid DrawingTool
 */
export const isDrawingTool = (value: any): value is DrawingTool => {
  // DrawingTool can be a DrawingMode or an object with mode property
  return isDrawingMode(value) || 
         (typeof value === 'object' && value !== null && 'mode' in value);
};

/**
 * Compare DrawingMode and DrawingTool values
 */
export const isSameDrawingTool = (tool: DrawingTool | DrawingMode, mode: DrawingMode | DrawingTool): boolean => {
  // Convert both to strings for comparison
  return String(tool) === String(mode);
};

/**
 * Get the string representation of a DrawingTool or DrawingMode
 */
export const getToolString = (tool: DrawingTool | DrawingMode): string => {
  if (typeof tool === 'string') {
    return tool;
  }
  
  if (typeof tool === 'object' && tool !== null && 'mode' in tool) {
    return String(tool.mode);
  }
  
  return String(tool);
};
