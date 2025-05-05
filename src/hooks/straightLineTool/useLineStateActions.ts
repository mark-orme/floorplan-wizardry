
import { useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { LineStateCore } from './useLineStateCore';

interface UseLineStateActionsProps {
  coreState: LineStateCore;
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (start: Point, end: Point) => Line;
  updateLine: (line: Line, start: Point, end: Point) => void;
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

  // Start drawing a line
  const startDrawing = useCallback((point: Point) => {
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapToGrid(point) : point;
    
    setIsDrawing(true);
    setStartPoint(snappedPoint);
    setCurrentPoint(snappedPoint);
    
    // Don't create line yet - wait for movement
  }, [setIsDrawing, setStartPoint, setCurrentPoint, snapEnabled, snapToGrid]);
  
  // Continue drawing as mouse moves
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // Apply snapping if enabled
    let snappedPoint = snapEnabled ? snapToGrid(point) : point;
    
    // Apply angle constraints if enabled
    if (anglesEnabled && startPoint) {
      snappedPoint = snapToAngle(startPoint, snappedPoint);
    }
    
    setCurrentPoint(snappedPoint);
    
    // Create or update line
    if (currentLine) {
      updateLine(currentLine, startPoint, snappedPoint);
    } else {
      const newLine = createLine(startPoint, snappedPoint);
      setCurrentLine(newLine);
    }
  }, [
    isDrawing,
    startPoint,
    currentLine,
    setCurrentPoint,
    setCurrentLine,
    snapEnabled,
    snapToGrid,
    anglesEnabled,
    snapToAngle,
    createLine,
    updateLine
  ]);
  
  // Complete drawing on mouse up
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // Apply snapping if enabled
    let snappedPoint = snapEnabled ? snapToGrid(point) : point;
    
    // Apply angle constraints if enabled
    if (anglesEnabled && startPoint) {
      snappedPoint = snapToAngle(startPoint, snappedPoint);
    }
    
    setCurrentPoint(snappedPoint);
    
    // Finalize the line
    if (currentLine) {
      updateLine(currentLine, startPoint, snappedPoint);
      finalizeLine(currentLine);
    } else {
      // If no line was created yet (e.g., click without drag), create one now
      createLine(startPoint, snappedPoint);
    }
    
    // Reset state
    setIsDrawing(false);
    setCurrentLine(null);
  }, [
    isDrawing,
    startPoint,
    currentLine,
    setCurrentPoint,
    setIsDrawing,
    setCurrentLine,
    snapEnabled,
    snapToGrid,
    anglesEnabled,
    snapToAngle,
    updateLine,
    finalizeLine,
    createLine
  ]);
  
  // Cancel drawing (e.g., on Esc key)
  const cancelDrawing = useCallback(() => {
    if (currentLine) {
      removeLine(currentLine);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
  }, [
    currentLine,
    setIsDrawing,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    removeLine
  ]);

  return {
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing
  };
};

export default useLineStateActions;
