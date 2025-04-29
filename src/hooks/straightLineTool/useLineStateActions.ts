
import { useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/fabric-unified';
import { LineStateCore } from './useLineStateCore';

interface LineStateActionsProps {
  coreState: LineStateCore;
  snapEnabled: boolean;
  snapToGrid: (point: Point) => Point;
  anglesEnabled: boolean;
  snapToAngle: (start: Point, end: Point) => Point;
  createLine: (x1: number, y1: number, x2: number, y2: number) => Line | null;
  updateLine: (line: Line, x2: number, y2: number) => Line | null;
  finalizeLine: (line: Line | null) => Line | null;
  removeLine: (line: Line | null) => void;
}

/**
 * Hook for handling line state actions
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
   * Handle mouse down to start line drawing
   */
  const handleMouseDown = useCallback((point: Point) => {
    if (isDrawing) return;

    const newStartPoint = snapEnabled ? snapToGrid(point) : point;
    setStartPoint(newStartPoint);
    setCurrentPoint(newStartPoint);
    setIsDrawing(true);

    const line = createLine(
      newStartPoint.x,
      newStartPoint.y,
      newStartPoint.x,
      newStartPoint.y
    );
    
    setCurrentLine(line);
  }, [isDrawing, snapEnabled, snapToGrid, setStartPoint, setCurrentPoint, setIsDrawing, createLine, setCurrentLine]);

  /**
   * Handle mouse move to update line drawing
   */
  const handleMouseMove = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;

    let newEndPoint = point;

    if (snapEnabled) {
      newEndPoint = snapToGrid(point);
    }

    if (anglesEnabled) {
      newEndPoint = snapToAngle(startPoint, newEndPoint);
    }

    setCurrentPoint(newEndPoint);
    updateLine(currentLine, newEndPoint.x, newEndPoint.y);
  }, [isDrawing, startPoint, currentLine, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, setCurrentPoint, updateLine]);

  /**
   * Handle mouse up to finish line drawing
   */
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentLine) return;

    if (startPoint && currentPoint &&
        (startPoint.x !== currentPoint.x || startPoint.y !== currentPoint.y)) {
      finalizeLine(currentLine);
    } else {
      removeLine(currentLine);
    }

    setCurrentLine(null);
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  }, [isDrawing, currentLine, startPoint, currentPoint, finalizeLine, removeLine, setCurrentLine, setIsDrawing, setStartPoint, setCurrentPoint]);

  /**
   * Cancel current drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !currentLine) return;

    removeLine(currentLine);
    setCurrentLine(null);
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  }, [isDrawing, currentLine, removeLine, setCurrentLine, setIsDrawing, setStartPoint, setCurrentPoint]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cancelDrawing
  };
};
