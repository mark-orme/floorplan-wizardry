/**
 * Hook for managing drawing state
 * @module useDrawingState
 */
import { useState, useCallback } from 'react';
import { DrawingState, createDefaultDrawingState } from '@/types/drawingTypes';
import { Point } from '@/types/drawingTypes';

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
      isDrawing: true
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
        ...prev
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
      return {
        ...prev,
        isDrawing: false
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
      ...prev
    }));
  }, []);
  
  /**
   * Update cursor position
   * @param point - Current cursor position
   */
  const updateCursorPosition = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev
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
    updateCursorPosition
  };
};
