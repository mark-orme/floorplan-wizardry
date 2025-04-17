
import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasToolCursorProps {
  fabricCanvas: FabricCanvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: DrawingMode;
  lineThickness?: number;
  showCustomCursor?: boolean;
}

export const useCanvasToolCursor = ({
  fabricCanvas,
  canvasRef,
  tool,
  lineThickness = 2,
  showCustomCursor = true
}: UseCanvasToolCursorProps) => {
  // Set cursor based on current tool
  useEffect(() => {
    if (!fabricCanvas || !canvasRef.current) return;
    
    // Don't set cursor style if using custom cursor
    if (tool === DrawingMode.DRAW && showCustomCursor) {
      canvasRef.current.style.cursor = 'none';
      return;
    }
    
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
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.WALL:
        // Hide default cursor, using custom preview instead
        canvasRef.current.style.cursor = 'none';
        break;
      case DrawingMode.RECTANGLE:
      case DrawingMode.CIRCLE:
        canvasRef.current.style.cursor = 'crosshair';
        break;
      case DrawingMode.TEXT:
        canvasRef.current.style.cursor = 'text';
        break;
      case DrawingMode.MEASURE:
        canvasRef.current.style.cursor = 'help';
        break;
      default:
        canvasRef.current.style.cursor = 'crosshair';
    }
  }, [fabricCanvas, tool, canvasRef, showCustomCursor]);
};
