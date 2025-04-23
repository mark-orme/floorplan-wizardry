import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { toolsLogger } from '@/utils/logger';

/**
 * Hook for line drawing operations
 */
export const useLineOperations = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  createLine: (x1: number, y1: number, x2: number, y2: number) => Line | null,
  updateLine: (line: Line, x1: number, y1: number, x2: number, y2: number) => void,
  finalizeLine: (line: Line, x1: number, y1: number, x2: number, y2: number) => void,
  removeLine: (line: Line) => void
) => {
  /**
   * Start drawing at a point
   */
  const startDrawingOperation = useCallback((
    point: Point,
    setIsActive: (value: boolean) => void,
    setIsDrawing: (value: boolean) => void,
    setStartPoint: (point: Point) => void,
    setCurrentPoint: (point: Point) => void,
    setCurrentLine: (line: Line | null) => void
  ) => {
    setIsActive(true);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    
    // Create initial line
    const line = createLine(point.x, point.y, point.x, point.y);
    if (line) {
      setCurrentLine(line);
      toolsLogger.debug('Started drawing line', { startPoint: point });
    }
  }, [createLine]);
  
  /**
   * Continue drawing to a point
   */
  const continueDrawingOperation = useCallback((
    point: Point,
    isDrawing: boolean,
    startPoint: Point | null,
    currentLine: Line | null,
    snapToGrid: (point: Point) => Point,
    snapToAngle: (start: Point, end: Point) => Point,
    snapEnabled: boolean,
    anglesEnabled: boolean,
    setCurrentPoint: (point: Point) => void
  ) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    let endPoint = point;
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled && startPoint) {
      endPoint = snapToAngle(startPoint, endPoint);
    }
    
    // Update current point
    setCurrentPoint(endPoint);
    
    // Update line
    updateLine(currentLine, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  }, [updateLine]);
  
  /**
   * Complete drawing at a point
   */
  const completeDrawingOperation = useCallback((
    point: Point,
    isDrawing: boolean,
    startPoint: Point | null,
    currentLine: Line | null,
    snapToGrid: (point: Point) => Point,
    snapToAngle: (start: Point, end: Point) => Point,
    snapEnabled: boolean,
    anglesEnabled: boolean,
    resetDrawingState: () => void
  ) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    let endPoint = point;
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled && startPoint) {
      endPoint = snapToAngle(startPoint, endPoint);
    }
    
    // Finalize line
    finalizeLine(currentLine, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    toolsLogger.debug('Completed drawing line', { 
      startPoint, 
      endPoint,
      lineId: (currentLine as any).id || 'unknown'
    });
    
    // Reset drawing state
    resetDrawingState();
  }, [finalizeLine]);
  
  /**
   * Cancel drawing
   */
  const cancelDrawingOperation = useCallback((
    isDrawing: boolean,
    currentLine: Line | null,
    resetDrawingState: () => void
  ) => {
    if (!isDrawing || !currentLine) return;
    
    // Remove the current line
    removeLine(currentLine);
    toolsLogger.debug('Drawing cancelled');
    
    // Reset drawing state
    resetDrawingState();
  }, [removeLine]);
  
  return {
    startDrawingOperation,
    continueDrawingOperation,
    completeDrawingOperation,
    cancelDrawingOperation
  };
};
