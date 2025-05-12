
import { useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { Canvas } from 'fabric';
import { UnifiedCanvas, asUnifiedCanvas } from '@/types/canvas-unified';

interface UseCanvasControllerToolsProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | UnifiedCanvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
}

export const useCanvasControllerTools = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness
}: UseCanvasControllerToolsProps) => {
  const initializeTools = useCallback(() => {
    // Get the canvas and verify it exists
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Create a unified canvas with all required properties
    const unifiedCanvas = asUnifiedCanvas(canvas);
    if (!unifiedCanvas) return;
    
    // Set drawing mode based on tool
    unifiedCanvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Configure the brush if available
    if (unifiedCanvas.freeDrawingBrush) {
      unifiedCanvas.freeDrawingBrush.color = lineColor;
      unifiedCanvas.freeDrawingBrush.width = lineThickness;
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  return {
    initializeTools
  };
};
