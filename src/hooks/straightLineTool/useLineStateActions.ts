
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import logger from '@/utils/logger';

interface UseLineStateActionsOptions {
  coreState: {
    isDrawing: boolean;
    setIsDrawing: (drawing: boolean) => void;
    startPoint: Point | null;
    setStartPoint: (point: Point | null) => void;
    currentPoint: Point | null;
    setCurrentPoint: (point: Point | null) => void;
  };
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (start: Point, end: Point) => any;
  updateLine: (line: any, start: Point, end: Point) => void;
  finalizeLine: (line: any) => void;
  removeLine: (line: any) => void;
}

/**
 * Line state actions hook
 */
export const useLineStateActions = ({
  coreState,
  snapEnabled,
  snapToGrid,
  anglesEnabled,
  snapToAngle,
  createLine,
  updateLine,
  finalizeLine,
  removeLine
}: UseLineStateActionsOptions) => {
  const { isDrawing, setIsDrawing, startPoint, setStartPoint, currentPoint, setCurrentPoint } = coreState;
  
  // Start drawing
  const startDrawing = useCallback((point: Point) => {
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    
    setIsDrawing(true);
    setStartPoint(snappedPoint);
    setCurrentPoint(snappedPoint);
    
    logger.debug('Started line drawing', { startPoint: snappedPoint });
  }, [snapEnabled, snapToGrid, setIsDrawing, setStartPoint, setCurrentPoint]);
  
  // Continue drawing
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    let processedPoint = point;
    
    // Apply snapping if enabled
    if (snapEnabled) {
      processedPoint = snapToGrid(point);
    }
    
    if (anglesEnabled && startPoint) {
      processedPoint = snapToAngle(startPoint, processedPoint);
    }
    
    setCurrentPoint(processedPoint);
  }, [isDrawing, startPoint, snapEnabled, snapToGrid, anglesEnabled, snapToAngle, setCurrentPoint]);
  
  // Complete drawing
  const completeDrawing = useCallback(() => {
    if (!isDrawing || !startPoint || !currentPoint) return;
    
    setIsDrawing(false);
    
    // Reset points
    setStartPoint(null);
    setCurrentPoint(null);
    
    logger.debug('Completed line drawing');
  }, [isDrawing, startPoint, currentPoint, setIsDrawing, setStartPoint, setCurrentPoint]);
  
  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    
    logger.debug('Cancelled line drawing');
  }, [setIsDrawing, setStartPoint, setCurrentPoint]);
  
  return {
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing
  };
};

export default useLineStateActions;
