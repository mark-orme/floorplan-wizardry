
import { useCallback, useState } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

export interface UseDrawingToolOptions {
  initialTool?: DrawingMode;
  onToolChange?: (tool: DrawingMode) => void;
}

export const useDrawingTool = (options: UseDrawingToolOptions = {}) => {
  const { initialTool = DrawingMode.SELECT, onToolChange } = options;
  const [currentTool, setCurrentTool] = useState<DrawingMode>(initialTool);
  
  const changeTool = useCallback((tool: DrawingMode) => {
    setCurrentTool(tool);
    
    if (onToolChange) {
      onToolChange(tool);
    }
    
    toast.info(`Tool changed to ${tool.toLowerCase()}`);
  }, [onToolChange]);
  
  const isDrawingMode = useCallback((tool: DrawingMode) => {
    return tool !== DrawingMode.SELECT && tool !== DrawingMode.HAND && tool !== DrawingMode.PAN;
  }, []);
  
  return {
    currentTool,
    changeTool,
    isDrawingMode,
    
    // Convenience methods
    selectTool: useCallback(() => changeTool(DrawingMode.SELECT), [changeTool]),
    drawTool: useCallback(() => changeTool(DrawingMode.DRAW), [changeTool]),
    lineTool: useCallback(() => changeTool(DrawingMode.LINE), [changeTool]),
    wallTool: useCallback(() => changeTool(DrawingMode.WALL), [changeTool]),
    roomTool: useCallback(() => changeTool(DrawingMode.ROOM), [changeTool])
  };
};
