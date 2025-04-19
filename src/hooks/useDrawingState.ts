
/**
 * Hook for managing drawing state
 * @module useDrawingState
 */
import { useState, useCallback } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/drawingTypes';
import type { Point } from '@/types/core/Geometry';
import type { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Hook for managing drawing state
 * @returns Drawing state management functions
 */
export const useDrawingState = () => {
  // Initialize with default state
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  const [currentTool, setCurrentTool] = useState<DrawingTool | null>(null);
  
  /**
   * Start drawing operation
   * @param x - Starting X coordinate
   * @param y - Starting Y coordinate
   */
  const startDrawing = useCallback((x: number, y: number) => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: { x, y },
      pathStartPoint: { x, y },
      points: [{ x, y }]
    }));
  }, []);
  
  /**
   * Update drawing with current position
   * @param x - Current X coordinate
   * @param y - Current Y coordinate
   */
  const updateDrawing = useCallback((x: number, y: number) => {
    setDrawingState(prev => {
      return {
        ...prev,
        currentPoint: { x, y },
        points: [...prev.points, { x, y }]
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
      const points = [...prev.points];
      if (x !== undefined && y !== undefined) {
        points.push({ x, y });
      }
      
      return {
        ...prev,
        isDrawing: false,
        points
      };
    });
  }, []);
  
  /**
   * Reset drawing state to initial values
   */
  const resetDrawing = useCallback(() => {
    setDrawingState(createDefaultDrawingState());
  }, []);
  
  /**
   * Update distance measurement
   * @param distance - Distance in meters
   */
  const updateDistance = useCallback((distance: number) => {
    setDrawingState(prev => ({
      ...prev,
      distance
    }));
  }, []);
  
  /**
   * Update cursor position
   * @param point - Current cursor position
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
    updateDistance,
    updateCursorPosition,
    currentTool,
    setCurrentTool
  };
};
