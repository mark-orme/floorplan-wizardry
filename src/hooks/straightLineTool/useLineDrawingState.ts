
import { useState, useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { toolsLogger } from '@/utils/logger';

/**
 * Hook for managing line drawing state
 */
export const useLineDrawingState = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    toolsLogger.debug('Drawing state reset');
  }, []);
  
  return {
    isDrawing,
    startPoint,
    currentPoint,
    currentLine,
    setIsDrawing,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    resetDrawingState
  };
};
