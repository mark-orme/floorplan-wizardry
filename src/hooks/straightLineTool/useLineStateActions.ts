import { useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';
import { lineToolLogger } from '@/utils/logger';

interface LineStateActionsProps {
  coreState: {
    isActive: boolean;
    isDrawing: boolean;
    startPoint: Point | null;
    currentPoint: Point | null;
    currentLine: Line | null;
    setIsDrawing: (isDrawing: boolean) => void;
    setStartPoint: (point: Point | null) => void;
    setCurrentPoint: (point: Point | null) => void;
    setCurrentLine: (line: Line | null) => void;
    inputMethod: InputMethod;
    isPencilMode: boolean;
    shiftKeyPressed: boolean;
    setShiftKeyPressed: (pressed: boolean) => void;
    setInputMethod: (method: InputMethod) => void;
    resetDrawingState: () => void;
  };
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (x1: number, y1: number) => Line;
  updateLine: (line: Line, startX: number, startY: number, endX: number, endY: number) => any;
  finalizeLine: (line: Line) => void;
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
}: LineStateActionsProps) => {
  /**
   * Start drawing a line
   */
  const startDrawing = useCallback((point: Point) => {
    if (!coreState.isActive || coreState.isDrawing) return;
    
    // Apply grid snapping if enabled
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    lineToolLogger.debug('Start drawing line', { original: point, snapped: snappedPoint });
    
    // Create a new line
    const line = createLine(snappedPoint.x, snappedPoint.y);
    
    // Update state
    coreState.setIsDrawing(true);
    coreState.setStartPoint(snappedPoint);
    coreState.setCurrentPoint(snappedPoint);
    coreState.setCurrentLine(line);
  }, [coreState, snapEnabled, snapToGrid, createLine]);
  
  /**
   * Continue drawing the current line
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!coreState.isDrawing || !coreState.startPoint || !coreState.currentLine) return;
    
    // Apply grid snapping if enabled
    let snappedPoint = snapEnabled ? snapToGrid(point) : point;
    
    // Apply angle snapping if enabled
    if (anglesEnabled && coreState.startPoint) {
      snappedPoint = snapToAngle(coreState.startPoint, snappedPoint);
    }
    
    // Apply shift key constraint (horizontal/vertical lines)
    if (coreState.shiftKeyPressed && coreState.startPoint) {
      const dx = Math.abs(snappedPoint.x - coreState.startPoint.x);
      const dy = Math.abs(snappedPoint.y - coreState.startPoint.y);
      
      if (dx > dy) {
        // Make horizontal line
        snappedPoint.y = coreState.startPoint.y;
      } else {
        // Make vertical line
        snappedPoint.x = coreState.startPoint.x;
      }
    }
    
    // Update the line
    if (coreState.startPoint) {
      updateLine(
        coreState.currentLine,
        coreState.startPoint.x,
        coreState.startPoint.y,
        snappedPoint.x,
        snappedPoint.y
      );
    }
    
    // Update state
    coreState.setCurrentPoint(snappedPoint);
  }, [
    coreState,
    snapEnabled,
    anglesEnabled,
    snapToGrid,
    snapToAngle,
    updateLine
  ]);
  
  /**
   * Complete the line drawing
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!coreState.isDrawing || !coreState.currentLine) return;
    
    // Apply final constraints to end point
    let finalPoint = point;
    if (snapEnabled) {
      finalPoint = snapToGrid(point);
    }
    
    if (anglesEnabled && coreState.startPoint) {
      finalPoint = snapToAngle(coreState.startPoint, finalPoint);
    }
    
    // Check if line has zero length
    const isZeroLength = coreState.startPoint && 
      coreState.startPoint.x === finalPoint.x && 
      coreState.startPoint.y === finalPoint.y;
    
    if (isZeroLength) {
      // Remove zero-length lines
      if (coreState.currentLine) {
        removeLine(coreState.currentLine);
      }
    } else {
      // Finalize the line
      if (coreState.currentLine && coreState.startPoint) {
        // Update line to final position
        updateLine(
          coreState.currentLine,
          coreState.startPoint.x,
          coreState.startPoint.y,
          finalPoint.x,
          finalPoint.y
        );
        
        // Finalize the line with the simplified signature
        finalizeLine(coreState.currentLine);
      }
    }
    
    // Reset drawing state
    coreState.resetDrawingState();
    lineToolLogger.debug('Completed drawing line', { finalPoint, isZeroLength });
  }, [
    coreState,
    snapEnabled,
    anglesEnabled,
    snapToGrid,
    snapToAngle,
    updateLine,
    finalizeLine,
    removeLine
  ]);
  
  /**
   * Cancel the current drawing operation
   */
  const cancelDrawing = useCallback(() => {
    if (!coreState.isDrawing || !coreState.currentLine) return;
    
    // Remove the current line
    removeLine(coreState.currentLine);
    
    // Reset drawing state
    coreState.resetDrawingState();
    lineToolLogger.debug('Cancelled drawing line');
  }, [coreState, removeLine]);
  
  /**
   * Handle key down events
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Handle escape key to cancel drawing
    if (event.key === 'Escape' && coreState.isDrawing) {
      cancelDrawing();
    }
    
    // Handle shift key for constraints
    if (event.key === 'Shift') {
      coreState.setShiftKeyPressed(true);
    }
  }, [coreState, cancelDrawing]);
  
  /**
   * Handle key up events
   */
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Handle shift key for constraints
    if (event.key === 'Shift') {
      coreState.setShiftKeyPressed(false);
    }
  }, [coreState]);
  
  return {
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    handleKeyDown,
    handleKeyUp
  };
};
