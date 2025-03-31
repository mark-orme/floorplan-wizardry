
/**
 * Hook for managing drawing state
 * @module useCanvasDrawingState
 */
import { useState, useCallback } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/core/DrawingState';
import { Point } from '@/types/core/Point';

/**
 * Hook for managing drawing state
 * @returns Drawing state and setter function
 */
export const useCanvasDrawingState = () => {
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  
  /**
   * Start drawing operation
   * @param {Point} point - Starting point
   */
  const startDrawing = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: point,
      pathStartPoint: point,
      points: [point],
      currentPoint: point
    }));
  }, []);
  
  /**
   * Update drawing with current point
   * @param {Point} point - Current point
   */
  const updateDrawing = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev,
      currentPoint: point,
      points: [...prev.points, point]
    }));
  }, []);
  
  /**
   * End drawing operation
   * @param {Point | null} point - Final point (optional)
   */
  const endDrawing = useCallback((point: Point | null = null) => {
    setDrawingState(prev => {
      const updatedPoints = point ? [...prev.points, point] : prev.points;
      return {
        ...prev,
        isDrawing: false,
        currentPoint: point || prev.currentPoint,
        points: updatedPoints
      };
    });
  }, []);
  
  /**
   * Reset drawing state
   */
  const resetDrawing = useCallback(() => {
    setDrawingState(createDefaultDrawingState());
  }, []);
  
  /**
   * Update zoom level
   * @param {number} zoom - New zoom level
   */
  const updateZoom = useCallback((zoom: number) => {
    setDrawingState(prev => ({
      ...prev,
      zoomLevel: zoom,
      currentZoom: zoom
    }));
  }, []);
  
  /**
   * Update cursor position
   * @param {Point} point - Current cursor position
   */
  const updateCursorPosition = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev,
      cursorPosition: point
    }));
  }, []);
  
  return {
    drawingState,
    setDrawingState,
    startDrawing,
    updateDrawing,
    endDrawing,
    resetDrawing,
    updateZoom,
    updateCursorPosition
  };
};
