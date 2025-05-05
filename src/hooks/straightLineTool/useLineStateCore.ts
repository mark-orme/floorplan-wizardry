
import { useState } from 'react';
import { Point } from '@/types/core/Point';

/**
 * Core line state hook
 */
export const useLineStateCore = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  return {
    isDrawing,
    setIsDrawing,
    startPoint,
    setStartPoint,
    currentPoint,
    setCurrentPoint
  };
};

export default useLineStateCore;
