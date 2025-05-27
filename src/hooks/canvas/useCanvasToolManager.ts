
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasToolManagerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
}

export const useCanvasToolManager = ({
  canvas,
  tool,
  lineColor,
  lineThickness
}: UseCanvasToolManagerProps) => {
  
  const configureToolSettings = useCallback(() => {
    if (!canvas) return;
    
    // Configure canvas based on active tool
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        break;
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        break;
    }
  }, [canvas, tool, lineColor, lineThickness]);
  
  return {
    configureToolSettings
  };
};
