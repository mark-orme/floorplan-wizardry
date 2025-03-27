
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
    currentZoom: 1,
    points: [],
    distance: null
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
      points: [point],
      distance: 0
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
      
      // Calculate distance if we have a start point
      let distance = prev.distance;
      if (prev.startPoint) {
        const dx = prev.startPoint.x - point.x;
        const dy = prev.startPoint.y - point.y;
        distance = Math.sqrt(dx * dx + dy * dy);
      }
      
      return {
        ...prev,
        currentPoint: point,
        cursorPosition: point,
        midPoint: prev.startPoint ? {
          x: (prev.startPoint.x + point.x) / 2,
          y: (prev.startPoint.y + point.y) / 2
        } : null,
        points: newPoints,
        distance
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
      currentZoom: 1,
      points: [],
      distance: null
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
