
import { useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { lineToolLogger } from '@/utils/logger';

interface UseLineStateActionsOptions {
  coreState: {
    isDrawing: boolean;
    startPoint: Point | null;
    currentLine: Line | null;
    setIsDrawing: (isDrawing: boolean) => void;
    setStartPoint: (point: Point | null) => void;
    setCurrentPoint: (point: Point | null) => void;
    setCurrentLine: (line: Line | null) => void;
    resetDrawingState: () => void;
  };
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (x1: number, y1: number, x2: number, y2: number) => Line | null;
  updateLine: (line: Line, x1: number, y1: number, x2: number, y2: number) => any;
  finalizeLine: (line: Line, x1: number, y1: number, x2: number, y2: number) => void;
  removeLine: (line: Line) => void;
}

/**
 * Hook for line state actions
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
  /**
   * Start drawing at a point
   */
  const startDrawing = useCallback((point: Point) => {
    coreState.setIsDrawing(true);
    coreState.setStartPoint(point);
    coreState.setCurrentPoint(point);
    
    // Create initial line
    const line = createLine(point.x, point.y, point.x, point.y);
    if (line) {
      coreState.setCurrentLine(line);
      lineToolLogger.debug('Started drawing line', { startPoint: point });
    }
  }, [coreState, createLine]);
  
  /**
   * Continue drawing to a point
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!coreState.isDrawing || !coreState.startPoint || !coreState.currentLine) return;
    
    // Apply snapping if enabled
    let endPoint = point;
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled && coreState.startPoint) {
      endPoint = snapToAngle(coreState.startPoint, endPoint);
    }
    
    // Update current point
    coreState.setCurrentPoint(endPoint);
    
    // Update line
    updateLine(
      coreState.currentLine, 
      coreState.startPoint.x, 
      coreState.startPoint.y, 
      endPoint.x, 
      endPoint.y
    );
  }, [coreState, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, updateLine]);
  
  /**
   * Complete drawing at a point
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!coreState.isDrawing || !coreState.startPoint || !coreState.currentLine) return;
    
    // Apply snapping if enabled
    let endPoint = point;
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled && coreState.startPoint) {
      endPoint = snapToAngle(coreState.startPoint, endPoint);
    }
    
    // Finalize line
    finalizeLine(
      coreState.currentLine, 
      coreState.startPoint.x, 
      coreState.startPoint.y, 
      endPoint.x, 
      endPoint.y
    );
    
    lineToolLogger.debug('Completed drawing line', { 
      startPoint: coreState.startPoint, 
      endPoint,
      lineId: (coreState.currentLine as any).id || 'unknown'
    });
    
    // Reset drawing state
    coreState.resetDrawingState();
  }, [coreState, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, finalizeLine]);
  
  /**
   * Cancel drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!coreState.isDrawing || !coreState.currentLine) return;
    
    // Remove the current line
    removeLine(coreState.currentLine);
    lineToolLogger.debug('Drawing cancelled');
    
    // Reset drawing state
    coreState.resetDrawingState();
  }, [coreState, removeLine]);
  
  return {
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing
  };
};
