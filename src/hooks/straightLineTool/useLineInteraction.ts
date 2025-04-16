
/**
 * Line interaction hook
 * Handles interaction events for the straight line tool
 * @module hooks/straightLineTool/useLineInteraction
 */
import { useCallback, useState } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Hook for managing line interactions
 * @returns Functions and state for line interactions
 */
export const useLineInteraction = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  
  /**
   * Start drawing a line
   * @param point Starting point
   */
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setStartPoint(point);
    setEndPoint(point);
  }, []);
  
  /**
   * Update the line while drawing
   * @param canvas Fabric canvas
   * @param line Line object
   * @param point Current point
   */
  const updateLine = useCallback((
    canvas: Canvas | null,
    line: Line | null,
    point: Point
  ): void => {
    if (!canvas || !line || !startPoint) return;
    
    // Update line end point
    setEndPoint(point);
    
    line.set({
      x2: point.x,
      y2: point.y
    });
    
    canvas.renderAll();
  }, [startPoint]);
  
  /**
   * Complete drawing the line
   */
  const completeDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);
  
  /**
   * Cancel drawing the line
   * @param canvas Fabric canvas
   * @param line Line object
   */
  const cancelDrawing = useCallback((
    canvas: Canvas | null,
    line: Line | null
  ): void => {
    if (!canvas || !line) return;
    
    canvas.remove(line);
    canvas.renderAll();
    
    setIsDrawing(false);
    setStartPoint(null);
    setEndPoint(null);
  }, []);
  
  return {
    isDrawing,
    startPoint,
    endPoint,
    startDrawing,
    updateLine,
    completeDrawing,
    cancelDrawing
  };
};
