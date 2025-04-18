
import { useCallback, useEffect } from 'react';
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
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        canvas.defaultCursor = 'crosshair';
        break;
        
      case DrawingMode.STRAIGHT_LINE:
        canvas.defaultCursor = 'crosshair';
        break;
    }
  }, [canvas, tool, lineColor, lineThickness]);

  useEffect(() => {
    configureToolSettings();
  }, [configureToolSettings]);

  return { configureToolSettings };
};
