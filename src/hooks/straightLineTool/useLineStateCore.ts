
import { useState, useRef } from 'react';
import { Point } from '@/types/core/Point';
import { Line } from 'fabric';

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
 * Hook for managing the core state of the line tool
 */
export const useLineStateCore = (): LineStateCore => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  // Point coordinates
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  // Current line being drawn
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
