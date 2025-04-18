
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
    
    // Reset canvas state
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'default';
    
    // Configure based on tool
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.forEachObject(obj => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
          canvas.freeDrawingBrush.limitedToCanvasBounds = true;
        }
        canvas.defaultCursor = 'crosshair';
        canvas.forEachObject(obj => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
        
      case DrawingMode.STRAIGHT_LINE:
        canvas.defaultCursor = 'crosshair';
        canvas.forEachObject(obj => {
          obj.selectable = false;
          obj.evented = false;
        });
        break;
        
      default:
        // Ensure objects are selectable by default for unknown tools
        canvas.forEachObject(obj => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;
    }
    
    canvas.requestRenderAll();
  }, [canvas, tool, lineColor, lineThickness]);

  useEffect(() => {
    configureToolSettings();
  }, [configureToolSettings]);

  return { configureToolSettings };
};
