
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, ILineOptions } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseLineDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for drawing lines on canvas
 */
export const useLineDrawing = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineDrawingProps) => {
  // Create a new line on canvas
  const createLine = useCallback((start: Point, end: Point): Line => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      throw new Error('Canvas is not initialized');
    }
    
    const lineOptions: ILineOptions = {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: true,
      evented: true
    };
    
    const line = new Line(
      [start.x, start.y, end.x, end.y],
      lineOptions
    );
    
    canvas.add(line);
    canvas.renderAll();
    
    return line;
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  // Update existing line's coordinates
  const updateLine = useCallback((line: Line, start: Point, end: Point): void => {
    if (!line) return;
    
    line.set({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });
    
    line.setCoords();
    
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);
  
  // Finalize a line (save state, add to history, etc.)
  const finalizeLine = useCallback((line: Line): void => {
    if (!line) return;
    
    // Make the line selectable again
    line.set({
      selectable: true,
      evented: true
    });
    
    saveCurrentState();
    
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.renderAll();
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  // Remove a line from canvas
  const removeLine = useCallback((line: Line): void => {
    if (!line) return;
    
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.remove(line);
      canvas.renderAll();
    }
  }, [fabricCanvasRef]);
  
  return {
    createLine,
    updateLine,
    finalizeLine,
    removeLine
  };
};

export default useLineDrawing;
