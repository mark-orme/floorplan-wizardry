
import { useCallback, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { lineToolLogger } from '@/utils/logger';

/**
 * Hook for managing line interactions
 */
export const useLineInteraction = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lineRef = useRef<Line | null>(null);
  
  /**
   * Start drawing at a point
   */
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    lineToolLogger.debug('Started drawing at point', point);
  }, []);
  
  /**
   * Update the current line
   */
  const updateLine = useCallback((
    canvas: FabricCanvas,
    line: Line,
    endPoint: Point
  ) => {
    if (!line) return;
    
    try {
      line.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      canvas.renderAll();
    } catch (error) {
      lineToolLogger.error('Error updating line', error);
    }
  }, []);
  
  /**
   * Complete drawing state
   */
  const completeDrawing = useCallback(() => {
    setIsDrawing(false);
    lineToolLogger.debug('Drawing completed');
  }, []);
  
  /**
   * Cancel drawing state
   */
  const cancelDrawing = useCallback((
    canvas: FabricCanvas,
    line: Line | null
  ) => {
    if (line && canvas.contains(line)) {
      canvas.remove(line);
      canvas.renderAll();
    }
    
    setIsDrawing(false);
    lineRef.current = null;
    lineToolLogger.debug('Drawing cancelled');
  }, []);
  
  return {
    isDrawing,
    lineRef,
    startDrawing,
    updateLine,
    completeDrawing,
    cancelDrawing
  };
};
