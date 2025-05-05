
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseLineDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useLineDrawing = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineDrawingProps) => {
  const createLine = useCallback((start: Point, end: Point): Line | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    const line = new Line([start.x, start.y, end.x, end.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    canvas.renderAll();
    
    return line;
  }, [fabricCanvasRef, lineColor, lineThickness]);

  const updateLine = useCallback((line: Line, start: Point, end: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    line.set({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });
    
    canvas.renderAll();
  }, [fabricCanvasRef]);

  const finalizeLine = useCallback((line: Line) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    line.set({
      selectable: true,
      evented: true
    });
    
    canvas.setActiveObject(line);
    canvas.renderAll();
    saveCurrentState();
  }, [fabricCanvasRef, saveCurrentState]);

  const removeLine = useCallback((line: Line) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.remove(line);
    canvas.renderAll();
  }, [fabricCanvasRef]);

  return {
    createLine,
    updateLine,
    finalizeLine,
    removeLine
  };
};

export default useLineDrawing;
