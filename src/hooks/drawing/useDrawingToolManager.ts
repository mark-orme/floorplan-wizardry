
import { useCallback, useState } from 'react';
import { fabric } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Type alias for FabricCanvas
type FabricCanvas = fabric.Canvas;

export interface UseDrawingToolManagerProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export const useDrawingToolManager = ({ canvasRef }: UseDrawingToolManagerProps) => {
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);

  const selectTool = useCallback((tool: DrawingMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Disable all drawing modes first
    canvas.isDrawingMode = false;
    
    // Apply tool-specific settings
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        break;
      case DrawingMode.SELECT:
        canvas.selection = true;
        break;
      case DrawingMode.RECTANGLE:
        // Set up for rectangle drawing
        canvas.selection = false;
        break;
      case DrawingMode.CIRCLE:
        // Set up for circle drawing
        canvas.selection = false;
        break;
      default:
        // Default behavior
        break;
    }
    
    setActiveTool(tool);
  }, [canvasRef]);
  
  const addRectangle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: 'rgba(255, 0, 0, 0.5)',
      stroke: '#ff0000',
      strokeWidth: 2
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  }, [canvasRef]);
  
  const addCircle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: 'rgba(0, 255, 0, 0.5)',
      stroke: '#00ff00',
      strokeWidth: 2
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  }, [canvasRef]);
  
  return {
    activeTool,
    selectTool,
    addRectangle,
    addCircle
  };
};
