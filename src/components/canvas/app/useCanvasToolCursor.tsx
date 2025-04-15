
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasToolCursorProps {
  fabricCanvas: FabricCanvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: DrawingMode;
}

export const useCanvasToolCursor = ({
  fabricCanvas,
  canvasRef,
  tool
}: UseCanvasToolCursorProps) => {
  // Set cursor based on current tool
  useEffect(() => {
    if (!fabricCanvas || !canvasRef.current) return;
    
    switch (tool) {
      case DrawingMode.SELECT:
        canvasRef.current.style.cursor = 'default';
        break;
      case DrawingMode.DRAW:
        canvasRef.current.style.cursor = 'crosshair';
        break;
      case DrawingMode.HAND:
        canvasRef.current.style.cursor = 'grab';
        break;
      case DrawingMode.ERASER:
        canvasRef.current.style.cursor = 'cell';
        break;
      default:
        canvasRef.current.style.cursor = 'crosshair';
    }
  }, [fabricCanvas, tool, canvasRef]);
};
