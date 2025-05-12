
import { useState } from 'react';
import { Point } from '@/types/core/Point';

export interface LineState {
  points: Point[];
  isActive: boolean;
}

export interface UseLineStateOptions {
  snapToGrid?: boolean;
  gridSize?: number;
}

export const useLineToolState = (options: UseLineStateOptions = {}) => {
  const { snapToGrid = false, gridSize = 20 } = options;
  
  const [lineState, setLineState] = useState<LineState>({
    points: [],
    isActive: false
  });

  // Function to snap points to grid if snapToGrid is enabled
  const snapPointToGrid = (point: Point): Point => {
    if (!snapToGrid) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  // Action handlers
  const startLine = (point: Point) => {
    const snappedPoint = snapPointToGrid(point);
    
    setLineState({
      points: [snappedPoint],
      isActive: true
    });
  };

  const updateLine = (point: Point) => {
    if (!lineState.isActive) return;
    
    const snappedPoint = snapPointToGrid(point);
    
    setLineState(prevState => ({
      ...prevState,
      points: [
        prevState.points[0],
        snappedPoint
      ]
    }));
  };

  const completeLine = () => {
    setLineState(prevState => ({
      ...prevState,
      isActive: false
    }));
  };

  const cancelLine = () => {
    setLineState({
      points: [],
      isActive: false
    });
  };

  const clearLines = () => {
    setLineState({
      points: [],
      isActive: false
    });
  };

  return {
    lineState,
    startLine,
    updateLine,
    completeLine,
    cancelLine,
    clearLines
  };
};

export default useLineToolState;
