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
   * Finalize a line by making it selectable and applying any final styles
   * @param line - The line to finalize
   * @param startX - Start X coordinate
   * @param startY - Start Y coordinate
   * @param endX - End X coordinate
   * @param endY - End Y coordinate
   * @returns The finalized line
   */
  const finalizeLine = useCallback((
    line: Line,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    if (!line) return null;
    
    try {
      // Ensure final position is set
      line.set({
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        selectable: true,
        evented: true
      });
      
      // Check if line has zero length
      const hasDimensions = Math.abs(startX - endX) > 1 || Math.abs(startY - endY) > 1;
      
      if (!hasDimensions) {
        // Remove lines that have no dimension (clicks without drags)
        const canvas = fabricCanvasRef.current;
        if (canvas) {
          canvas.remove(line);
          canvas.requestRenderAll();
        }
        return null;
      }
      
      // Otherwise finalize the line
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.requestRenderAll();
      }
      
      return line;
    } catch (error) {
      console.error("Error finalizing line", error);
      return null;
    }
  }, [fabricCanvasRef]);
  
  /**
   * Remove a line from the canvas
   * @param line - The line to remove
   */
  const removeLine = useCallback((line: Line) => {
    if (!line) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.remove(line);
        canvas.requestRenderAll();
      }
    } catch (error) {
      console.error("Error removing line", error);
    }
  }, [fabricCanvasRef]);
  
  return {
    finalizeLine,
    removeLine
  };
};
