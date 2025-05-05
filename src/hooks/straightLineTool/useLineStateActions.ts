
import { useCallback } from 'react';
import { Line } from 'fabric';
import { LineStateCore } from './useLineStateCore';
import { Point } from '@/types/core/Point';

interface UseLineStateActionsProps {
  coreState: LineStateCore;
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (start: Point, end: Point) => Line | null;
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
    isDrawing, setIsDrawing, 
    startPoint, setStartPoint, 
    currentPoint, setCurrentPoint,
    currentLine, setCurrentLine
  } = coreState;

  const handleMouseDown = useCallback((point: Point) => {
    let snappedPoint = point;
    
    if (snapEnabled) {
      snappedPoint = snapToGrid(point);
    }
    
    setStartPoint(snappedPoint);
    setCurrentPoint(snappedPoint);
    setIsDrawing(true);
    
    const line = createLine(snappedPoint, snappedPoint);
    if (line) {
      setCurrentLine(line);
    }
  }, [snapEnabled, snapToGrid, setStartPoint, setCurrentPoint, setIsDrawing, setCurrentLine, createLine]);

  const handleMouseMove = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    let newEndPoint = point;
    
    if (snapEnabled) {
      newEndPoint = snapToGrid(newEndPoint);
    }
    
    if (anglesEnabled && startPoint) {
      newEndPoint = snapToAngle(startPoint, newEndPoint);
    }
    
    setCurrentPoint(newEndPoint);
    updateLine(currentLine, startPoint, newEndPoint);
  }, [isDrawing, startPoint, currentLine, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, setCurrentPoint, updateLine]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentLine) return;
    
    finalizeLine(currentLine);
    setIsDrawing(false);
    setCurrentLine(null);
  }, [isDrawing, currentLine, finalizeLine, setIsDrawing, setCurrentLine]);

  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !currentLine) return;
    
    removeLine(currentLine);
    setIsDrawing(false);
    setCurrentLine(null);
  }, [isDrawing, currentLine, removeLine, setIsDrawing, setCurrentLine]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing
  };
};

export default useLineStateActions;
