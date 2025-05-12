
import { useCallback, useState } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasToolManagerOptions {
  canvas: Canvas | null;
  initialTool?: DrawingMode;
}

export const useCanvasToolManager = ({
  canvas,
  initialTool = DrawingMode.SELECT,
}: UseCanvasToolManagerOptions) => {
  const [currentTool, setCurrentTool] = useState<DrawingMode>(initialTool);
  
  // Set up the canvas for the current tool
  const setupCanvasForTool = useCallback((tool: DrawingMode) => {
    if (!canvas) return;
    
    // Reset canvas settings
    canvas.isDrawingMode = false;
    canvas.selection = tool === DrawingMode.SELECT;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    
    // Apply tool-specific settings
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = '#000000';
        canvas.freeDrawingBrush.width = 2;
        break;
      case DrawingMode.SELECT:
        canvas.selection = true;
        break;
      case DrawingMode.PAN:
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        break;
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
      case DrawingMode.LINE:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
      default:
        break;
    }
    
    // Update current tool
    setCurrentTool(tool);
  }, [canvas]);
  
  // Handle tool changes
  const setTool = useCallback((tool: DrawingMode) => {
    setupCanvasForTool(tool);
  }, [setupCanvasForTool]);
  
  return {
    currentTool,
    setTool,
    setupCanvasForTool,
  };
};

export default useCanvasToolManager;
