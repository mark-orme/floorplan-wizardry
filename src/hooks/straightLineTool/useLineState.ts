
import { useRef, useState, useCallback } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Hook to manage state for straight line drawing
 */
export const useLineState = () => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // References to avoid re-renders
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  /**
   * Set start point for line
   */
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
    setIsDrawing(true);
  }, []);
  
  /**
   * Set current line object
   */
  const setCurrentLine = useCallback((line: Line) => {
    currentLineRef.current = line;
  }, []);
  
  /**
   * Set distance tooltip
   */
  const setDistanceTooltip = useCallback((tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Initialize tool
   */
  const setIsToolInitialized = useCallback(() => {
    setIsToolInitialized(true);
  }, []);
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }, []);
  
  return {
    isDrawing,
    setIsDrawing,
    isToolInitialized,
    setIsToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    resetDrawingState
  };
};
