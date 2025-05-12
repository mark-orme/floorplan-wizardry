
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
  const [isDrawing, setIsDrawing] = useState(false);
  
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
  
  // Additional for test compatibility
  const isValidDrawingTool = useCallback((value: any): boolean => {
    return Object.values(DrawingMode).includes(value as DrawingMode);
  }, []);

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    console.log('startDrawing');
  }, []);
  
  const continueDrawing = useCallback(() => {
    console.log('continueDrawing');
  }, []);
  
  const endDrawing = useCallback(() => {
    setIsDrawing(false);
    console.log('endDrawing');
  }, []);

  return {
    // New API
    activeTool: currentTool,
    selectTool: changeTool,
    lineColor: '#000000',
    lineThickness: 2,
    setColor: (color: string) => console.log('setColor', color),
    setThickness: (thickness: number) => console.log('setThickness', thickness),
    createShape: (type: 'rect' | 'circle' | 'text') => console.log('createShape', type),
    addText: (text?: string, left?: number, top?: number) => console.log('addText', text, left, top),
    
    // Old API for backwards compatibility with tests
    currentTool,
    changeTool,
    isDrawingMode,
    isValidDrawingTool,
    
    // Test compatibility properties
    tool: currentTool,
    setTool: changeTool,
    startDrawing,
    continueDrawing,
    endDrawing,
    isDrawing
  };
};
