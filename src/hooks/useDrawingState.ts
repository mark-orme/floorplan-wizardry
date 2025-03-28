
/**
 * Hook for managing drawing state
 * @module useDrawingState
 */
import { useState, useCallback } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/drawingTypes';
import { Point, createPoint } from '@/types/core/Point';

/**
 * Hook for managing drawing state
 * @returns Drawing state management functions
 */
export const useDrawingState = () => {
  // Initialize with default state
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  
  /**
   * Start drawing operation
   * @param x - Starting X coordinate
   * @param y - Starting Y coordinate
   */
  const startDrawing = useCallback((x: number, y: number) => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startX: x,
      startY: y,
      lastX: x,
      lastY: y,
      startPoint: createPoint(x, y),
      currentPoint: createPoint(x, y),
      points: [createPoint(x, y)]
    }));
  }, []);
  
  /**
   * Update drawing with current position
   * @param x - Current X coordinate
   * @param y - Current Y coordinate
   */
  const updateDrawing = useCallback((x: number, y: number) => {
    setDrawingState(prev => {
      const newPoint = createPoint(x, y);
      return {
        ...prev,
        lastX: x,
        lastY: y,
        currentPoint: newPoint,
        points: [...prev.points, newPoint]
      };
    });
  }, []);
  
  /**
   * End drawing operation
   * @param x - Ending X coordinate
   * @param y - Ending Y coordinate
   */
  const endDrawing = useCallback((x?: number, y?: number) => {
    setDrawingState(prev => {
      const updatedPoints = x !== undefined && y !== undefined 
        ? [...prev.points, createPoint(x, y)] 
        : prev.points;
        
      return {
        ...prev,
        isDrawing: false,
        lastX: x !== undefined ? x : prev.lastX,
        lastY: y !== undefined ? y : prev.lastY,
        currentPoint: x !== undefined && y !== undefined ? createPoint(x, y) : prev.currentPoint,
        points: updatedPoints
      };
    });
  }, []);
  
  /**
   * Reset drawing state to initial values
   */
  const resetDrawing = useCallback(() => {
    setDrawingState(createDefaultDrawingState());
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
