
import { useCallback, useState, useRef } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Hook for managing straight line drawing state
 */
export const useLineState = () => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // References for drawing objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Initialize the tool
  const initializeTool = useCallback(() => {
    console.log('Initializing straight line tool state');
    setIsToolInitialized(true);
  }, []);
  
  // Set the start point for drawing
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
  }, []);
  
  // Set the current line being drawn
  const setCurrentLine = useCallback((line: Line) => {
    currentLineRef.current = line;
  }, []);
  
  // Set the distance tooltip
  const setDistanceTooltip = useCallback((tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  // Reset the drawing state
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }, []);
  
  return {
    isDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    initializeTool,
    resetDrawingState
  };
};
