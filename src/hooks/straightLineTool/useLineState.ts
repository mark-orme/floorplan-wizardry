
/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useState, useRef, useCallback } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Geometry';
import logger from '@/utils/logger';

/**
 * Hook for managing internal state of the line drawing operation
 * @returns State and functions for line drawing
 */
export const useLineState = () => {
  // Track if we're currently drawing
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Track if the tool has been properly initialized
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Refs to track the current line being drawn
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Initialize the tool state
  const initializeTool = useCallback(() => {
    console.log("Initializing line tool state");
    setIsToolInitialized(true);
    resetDrawingState();
  }, []);
  
  // Set the start point of the line
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
    console.log("Resetting line drawing state");
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
