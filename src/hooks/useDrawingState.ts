import { useState, useCallback } from 'react';
import { DrawingState, Point } from '@/types';

/**
 * Hook for managing drawing state
 * @returns Drawing state and update functions
 */
const useDrawingState = () => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    cursorPosition: null,
    midPoint: null,
    selectionActive: false,
    points: []
  });

  /**
   * Start drawing from a point
   * @param point Starting point
   */
  const startDrawing = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      points: [point]
    }));
  }, []);

  /**
   * Update drawing with current point
   * @param point Current point
   */
  const updateDrawing = useCallback((point: Point) => {
    setDrawingState(prev => {
      // Only add points if we're actually drawing
      if (!prev.isDrawing) {
        return {
          ...prev,
          cursorPosition: point
        };
      }

      const newPoints = prev.points ? [...prev.points, point] : [point];
      
      return {
        ...prev,
        currentPoint: point,
        cursorPosition: point,
        midPoint: prev.startPoint ? {
          x: (prev.startPoint.x + point.x) / 2,
          y: (prev.startPoint.y + point.y) / 2
        } : null,
        points: newPoints
      };
    });
  }, []);

  /**
   * End drawing
   */
  const endDrawing = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      // Keep other properties for reference
    }));
  }, []);

  /**
   * Reset drawing state
   */
  const resetDrawing = useCallback(() => {
    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      cursorPosition: null,
      midPoint: null,
      selectionActive: false,
      points: []
    });
  }, []);

  return {
    drawingState,
    setDrawingState,
    startDrawing,
    updateDrawing,
    endDrawing,
    resetDrawing
  };
};

export default useDrawingState;
