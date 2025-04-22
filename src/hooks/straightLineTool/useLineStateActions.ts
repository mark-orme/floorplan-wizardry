
import { useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Line } from 'fabric';
import { LineStateCore } from './useLineStateCore'; 

interface UseLineStateActionsProps {
  coreState: LineStateCore;
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (x1: number, y1: number, x2: number, y2: number) => Line | null;
  updateLine: (line: Line, x1: number, y1: number, x2: number, y2: number) => any;
  finalizeLine: (line: Line) => void;
  removeLine: (line: Line) => void;
}

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
}: UseLineStateActionsProps) => {
  // Destructure core state for easier access
  const { 
    isDrawing, 
    setIsDrawing, 
    startPoint, 
    setStartPoint, 
    currentPoint, 
    setCurrentPoint,
    currentLine,
    setCurrentLine
  } = coreState;
  
  /**
   * Start drawing a line
   */
  const startDrawing = useCallback((point: Point) => {
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    
    // Set initial state
    setIsDrawing(true);
    setStartPoint(snappedPoint);
    setCurrentPoint(snappedPoint);
    
    // Create new line
    const line = createLine(
      snappedPoint.x, 
      snappedPoint.y, 
      snappedPoint.x, 
      snappedPoint.y
    );
    
    if (line) {
      setCurrentLine(line);
    }
  }, [snapEnabled, snapToGrid, setIsDrawing, setStartPoint, setCurrentPoint, createLine, setCurrentLine]);
  
  /**
   * Continue drawing (updating) a line
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping and constraints
    let processedPoint = point;
    
    if (snapEnabled) {
      processedPoint = snapToGrid(point);
    }
    
    if (anglesEnabled) {
      processedPoint = snapToAngle(startPoint, processedPoint);
    }
    
    // Update current point state
    setCurrentPoint(processedPoint);
    
    // Update line on canvas
    updateLine(
      currentLine, 
      startPoint.x, 
      startPoint.y, 
      processedPoint.x, 
      processedPoint.y
    );
  }, [
    isDrawing, 
    startPoint, 
    currentLine, 
    snapEnabled, 
    anglesEnabled, 
    snapToGrid, 
    snapToAngle, 
    setCurrentPoint, 
    updateLine
  ]);
  
  /**
   * Complete the line drawing
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping and constraints for final point
    let finalPoint = point;
    
    if (snapEnabled) {
      finalPoint = snapToGrid(point);
    }
    
    if (anglesEnabled) {
      finalPoint = snapToAngle(startPoint, finalPoint);
    }
    
    // Check if the line has non-zero length
    const hasLength = 
      startPoint.x !== finalPoint.x || 
      startPoint.y !== finalPoint.y;
    
    // Update or remove the line
    if (hasLength) {
      // Update line to final position
      updateLine(
        currentLine, 
        startPoint.x, 
        startPoint.y, 
        finalPoint.x, 
        finalPoint.y
      );
      
      // Finalize the line
      finalizeLine(currentLine);
    } else {
      // Remove zero-length line
      removeLine(currentLine);
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
  }, [
    isDrawing, 
    startPoint, 
    currentLine, 
    snapEnabled, 
    anglesEnabled, 
    snapToGrid, 
    snapToAngle, 
    updateLine, 
    finalizeLine, 
    removeLine, 
    setIsDrawing, 
    setStartPoint, 
    setCurrentPoint, 
    setCurrentLine
  ]);
  
  /**
   * Cancel the current line drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !currentLine) return;
    
    // Remove the line
    removeLine(currentLine);
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
  }, [
    isDrawing, 
    currentLine, 
    removeLine, 
    setIsDrawing, 
    setStartPoint, 
    setCurrentPoint, 
    setCurrentLine
  ]);
  
  return {
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
  };
};
