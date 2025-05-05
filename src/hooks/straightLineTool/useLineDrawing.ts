
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Line } from 'fabric';

interface UseLineDrawingOptions {
  fabricCanvasRef: React.MutableRefObject<any>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for line drawing functionality
 */
export const useLineDrawing = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineDrawingOptions) => {
  const currentLineRef = useCallback(() => {
    return fabricCanvasRef.current?.getActiveObject();
  }, [fabricCanvasRef]);
  
  // Create a new line
  const createLine = useCallback((start: Point, end: Point) => {
    if (!fabricCanvasRef.current) return null;
    
    const points = [start.x, start.y, end.x, end.y];
    const line = new Line(points, {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      objectCaching: false
    });
    
    fabricCanvasRef.current.add(line);
    fabricCanvasRef.current.renderAll();
    
    return line;
  }, [fabricCanvasRef, lineColor, lineThickness]);
  
  // Update an existing line
  const updateLine = useCallback((line: any, start: Point, end: Point) => {
    if (!fabricCanvasRef.current || !line) return;
    
    line.set({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });
    
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);
  
  // Finalize a line (make it selectable)
  const finalizeLine = useCallback((line: any) => {
    if (!fabricCanvasRef.current || !line) return;
    
    line.set({
      selectable: true,
      evented: true
    });
    
    fabricCanvasRef.current.renderAll();
    saveCurrentState();
  }, [fabricCanvasRef, saveCurrentState]);
  
  // Remove a line
  const removeLine = useCallback((line: any) => {
    if (!fabricCanvasRef.current || !line) return;
    
    fabricCanvasRef.current.remove(line);
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef]);
  
  return {
    createLine,
    updateLine,
    finalizeLine,
    removeLine,
    currentLineRef
  };
};

export default useLineDrawing;
