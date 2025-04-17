
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';

/**
 * Hook for finalizing and removing lines
 */
export const useLineFinalizer = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  saveCurrentState: () => void
) => {
  /**
   * Finalize a line by setting its final coordinates
   */
  const finalizeLine = useCallback((
    line: Line,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Update line coordinates
      line.set({
        x1,
        y1,
        x2,
        y2
      });
      
      // Mark line as complete
      (line as any).isComplete = true;
      
      // Update canvas
      canvas.renderAll();
      
      // Save current state for undo/redo
      saveCurrentState();
    } catch (error) {
      console.error('Error finalizing line:', error);
    }
  }, [fabricCanvasRef, saveCurrentState]);
  
  /**
   * Remove a line from the canvas
   */
  const removeLine = useCallback((line: Line) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      canvas.remove(line);
      canvas.renderAll();
    } catch (error) {
      console.error('Error removing line:', error);
    }
  }, [fabricCanvasRef]);
  
  return {
    finalizeLine,
    removeLine
  };
};
