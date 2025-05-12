
import { useCallback } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { ExtendedFabricCanvas, asExtendedCanvas } from '@/types/canvas-types';

// Create a simple mock for the missing module
const useCanvasToolManager = () => {
  return {
    setTool: () => {},
    currentTool: DrawingMode.SELECT
  };
};

interface UseCanvasControllerToolsProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | ExtendedFabricCanvas | null>;
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
    // Handle both types correctly
    const canvas = asExtendedCanvas(fabricCanvasRef.current);
    
    if (!canvas) return;

    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  return {
    initializeTools
  };
};
