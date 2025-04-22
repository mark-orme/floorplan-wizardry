
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';
import { asDrawingTool } from '@/types/core/DrawingToolAdapter';

/**
 * Hook to adapt DrawingMode to DrawingTool for test files
 * This handles type compatibility issues between the two types
 */
export const useDrawingToolAdapter = () => {
  /**
   * Convert a DrawingMode to a DrawingTool for type compatibility
   */
  const adaptDrawingMode = (mode: DrawingMode): DrawingTool => {
    return asDrawingTool(mode);
  };
  
  /**
   * Compare a DrawingTool with a DrawingMode
   */
  const compareTools = (tool: DrawingTool, mode: DrawingMode): boolean => {
    return String(tool) === String(mode);
  };
  
  return {
    adaptDrawingMode,
    compareTools
  };
};
