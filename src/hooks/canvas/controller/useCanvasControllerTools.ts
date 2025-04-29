// Update your imports
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

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
  const initializeTools = () => {
    // Handle both types correctly
    const canvas = fabricCanvasRef.current as ExtendedFabricCanvas;
    
    if (!canvas) return;

    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
  };
  
  return {
    initializeTools
  };
};
