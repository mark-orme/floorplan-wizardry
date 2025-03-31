
import { useState, useRef, useCallback } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Geometry';
import logger from '@/utils/logger';

/**
 * Hook to manage state for drawing straight lines
 * @returns Line drawing state and helper functions
 */
export const useLineState = () => {
  // Track if we're currently drawing a line
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Track if the tool is fully initialized
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Refs for line drawing state
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Function to set line starting point
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
    console.log(`Line start point set to: x=${point.x}, y=${point.y}`);
  }, []);
  
  // Function to track the current line being drawn
  const setCurrentLine = useCallback((line: Line) => {
    currentLineRef.current = line;
    console.log("Current line reference set");
  }, []);
  
  // Function to track distance tooltip
  const setDistanceTooltip = useCallback((tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  // Function to initialize the tool
  const initializeTool = useCallback(() => {
    logger.info("Initializing straight line tool state");
    setIsToolInitialized(true);
  }, []);
  
  // Function to reset drawing state
  const resetDrawingState = useCallback(() => {
    logger.info("Resetting line drawing state");
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }, []);
  
  return {
    isDrawing,
    setIsDrawing,
    isToolInitialized,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    initializeTool,
    resetDrawingState
  };
};

export type LineState = ReturnType<typeof useLineState>;
