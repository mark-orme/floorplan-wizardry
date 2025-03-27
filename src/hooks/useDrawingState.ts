
import { useState, useCallback } from 'react';
import { DrawingState, Point } from '@/types';

/**
 * Hook for managing drawing state in canvas
 * @returns Drawing state and update functions
 */
export const useDrawingState = () => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    midPoint: null,
    selectionActive: false,
    currentZoom: 1,
    points: [],
    distance: null
  });

  /**
   * Start drawing at specified point
   * @param point Starting point coordinates
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
   * @param point Current point coordinates
   * @param midPoint Optional midpoint for curves
   */
  const updateDrawing = useCallback((point: Point, midPoint: Point | null = null) => {
    setDrawingState(prev => ({
      ...prev,
      currentPoint: point,
      midPoint,
      points: [...prev.points, point]
    }));
  }, []);

  /**
   * End drawing
   */
  const endDrawing = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false
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
      midPoint: null,
      selectionActive: false,
      currentZoom: 1,
      points: [],
      distance: null
    });
  }, []);

  /**
   * Update distance measurement
   * @param distance Distance value
   */
  const updateDistance = useCallback((distance: number | null) => {
    setDrawingState(prev => ({
      ...prev,
      distance
    }));
  }, []);

  return {
    drawingState,
    setDrawingState,
    startDrawing,
    updateDrawing,
    endDrawing,
    resetDrawing,
    updateDistance
  };
};
