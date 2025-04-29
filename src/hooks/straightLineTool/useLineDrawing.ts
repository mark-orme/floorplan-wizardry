
import { useCallback } from 'react';
import { Line, Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/fabric-unified';

interface UseLineDrawingOptions {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for handling line drawing operations on canvas
 */
export const useLineDrawing = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineDrawingOptions) => {
  /**
   * Create a new line on the canvas
   */
  const createLine = useCallback((x1: number, y1: number, x2: number, y2: number): Line | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;

    const line = new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });

    canvas.add(line);
    canvas.renderAll();
    return line;
  }, [fabricCanvasRef, lineColor, lineThickness]);

  /**
   * Update an existing line on the canvas
   */
  const updateLine = useCallback((line: Line, x2: number, y2: number): Line | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return null;

    line.set({ x2, y2 });
    canvas.renderAll();
    return line;
  }, [fabricCanvasRef]);

  /**
   * Finalize a line by making it selectable
   */
  const finalizeLine = useCallback((line: Line | null): Line | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return null;

    line.set({
      selectable: true,
      evented: true
    });
    
    canvas.renderAll();
    saveCurrentState();
    return line;
  }, [fabricCanvasRef, saveCurrentState]);

  /**
   * Remove a line from the canvas
   */
  const removeLine = useCallback((line: Line | null): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !line) return;

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
