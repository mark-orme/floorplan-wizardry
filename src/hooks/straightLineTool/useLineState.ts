
/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useRef, useState } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Hook for managing line drawing state
 * @returns Line state and state management functions
 */
export const useLineState = () => {
  // Get the error reporting hook
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();
  
  // State tracking
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // References to drawing objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  /**
   * Initialize the line tool
   */
  const initializeTool = useCallback(() => {
    try {
      setIsToolInitialized(true);
      logDrawingEvent('Line tool initialized', 'tool-init', {
        tool: DrawingMode.LINE
      });
    } catch (error) {
      reportDrawingError(error, 'line-tool-init', {
        tool: DrawingMode.LINE
      });
      // Initialize anyway to avoid blocking the user
      setIsToolInitialized(true);
    }
  }, [logDrawingEvent, reportDrawingError]);
  
  /**
   * Reset the drawing state
   */
  const resetDrawingState = useCallback(() => {
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
    setIsDrawing(false);
  }, []);
  
  /**
   * Set the current line
   */
  const setCurrentLine = useCallback((line: Line | null) => {
    currentLineRef.current = line;
  }, []);
  
  /**
   * Set the distance tooltip
   */
  const setDistanceTooltip = useCallback((tooltip: Text | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Set the start point
   */
  const setStartPoint = useCallback((point: Point | null) => {
    startPointRef.current = point;
  }, []);
  
  return {
    // State
    isDrawing,
    isToolInitialized,
    
    // Refs
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    
    // Setters
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    
    // Methods
    initializeTool,
    resetDrawingState
  };
};
