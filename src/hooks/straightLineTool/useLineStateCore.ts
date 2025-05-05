
import { useState } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';

export interface LineStateCore {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  startPoint: Point | null;
  setStartPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  currentPoint: Point | null;
  setCurrentPoint: React.Dispatch<React.SetStateAction<Point | null>>;
  currentLine: Line | null;
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
}

/**
 * Core state management for line tools
 */
export const useLineStateCore = (): LineStateCore => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  return {
    isDrawing,
    setIsDrawing,
    startPoint,
    setStartPoint,
    currentPoint,
    setCurrentPoint,
    currentLine,
    setCurrentLine
  };
};

export default useLineStateCore;
