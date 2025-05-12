
import { useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { UnifiedCanvas, asUnifiedCanvas } from '@/types/unified-canvas';

interface UseCanvasControllerToolsProps {
  fabricCanvasRef: React.MutableRefObject<UnifiedCanvas | null>;
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
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Configure the brush if available
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  return {
    initializeTools
  };
};
