import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasToolManagerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
}

export function useCanvasToolManager({
  canvas,
  tool,
  lineColor,
  lineThickness
}: UseCanvasToolManagerProps) {
  // Configure canvas based on selected tool
  const configureToolSettings = useCallback(() => {
    if (!canvas) return;
    
    // Reset canvas settings
    canvas.isDrawingMode = false;
    canvas.selection = true;
    
    // Configure based on tool
    switch (tool) {
      case DrawingMode.PENCIL:
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
        break;
      
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        break;
      
      case DrawingMode.RECTANGLE:
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
        
      case DrawingMode.CIRCLE:
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
        
      case DrawingMode.LINE:
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
        
      case DrawingMode.WALL:
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
        
      case DrawingMode.ROOM:
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
        
      case DrawingMode.MEASURE:
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
        
      case DrawingMode.TEXT:
        canvas.defaultCursor = 'text';
        canvas.selection = false;
        break;
        
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        canvas.selection = false;
        break;
      
      default:
        canvas.defaultCursor = 'default';
        break;
    }
    
    canvas.requestRenderAll();
  }, [canvas, tool, lineColor, lineThickness]);
  
  return {
    configureToolSettings
  };
}
