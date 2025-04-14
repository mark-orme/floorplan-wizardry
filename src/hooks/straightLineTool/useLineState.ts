
/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useRef, useState } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import logger from '@/utils/logger';

/**
 * Return type for useLineState hook
 */
interface UseLineStateResult {
  /** Whether the line tool is initialized */
  isToolInitialized: boolean;
  /** Whether currently drawing a line */
  isDrawing: boolean;
  /** Start point of the current line */
  startPointRef: React.MutableRefObject<Point | null>;
  /** Current line being drawn */
  currentLineRef: React.MutableRefObject<Line | null>;
  /** Distance tooltip for the current line */
  distanceTooltipRef: React.MutableRefObject<Text | null>;
  /** Set whether drawing is in progress */
  setIsDrawing: (isDrawing: boolean) => void;
  /** Set the start point of the current line */
  setStartPoint: (point: Point) => void;
  /** Set the current line being drawn */
  setCurrentLine: (line: Line | null) => void;
  /** Set the distance tooltip for the current line */
  setDistanceTooltip: (tooltip: Text | null) => void;
  /** Initialize the line tool */
  initializeTool: () => void;
  /** Reset the drawing state */
  resetDrawingState: () => void;
}

/**
 * Hook for managing line drawing state
 * 
 * @returns {UseLineStateResult} Line state and setters
 */
export const useLineState = (): UseLineStateResult => {
  // State flags
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Refs to track drawing objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  // Initialize the tool
  const initializeTool = useCallback(() => {
    logger.info("Initializing line tool state");
    setIsToolInitialized(true);
    resetDrawingState();
  }, []);
  
  // Reset drawing state
  const resetDrawingState = useCallback(() => {
    logger.info("Resetting line drawing state");
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }, []);
  
  // Setter functions for refs
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
  }, []);
  
  const setCurrentLine = useCallback((line: Line | null) => {
    currentLineRef.current = line;
  }, []);
  
  const setDistanceTooltip = useCallback((tooltip: Text | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);

  return {
    isToolInitialized,
    isDrawing,
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
