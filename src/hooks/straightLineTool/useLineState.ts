
import { useState, useRef } from 'react';
import { Line, Point as FabricPoint, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';

/**
 * Hook for managing straight line drawing state
 */
export const useLineState = () => {
  // State for tracking drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const startPointRef = useRef<FabricPoint | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  /**
   * Initialize the tool state
   */
  const initializeTool = () => {
    logger.info("Initializing straight line tool state");
    setIsToolInitialized(true);
    captureMessage("Straight line tool state initialized", "straight-line-state-init");
  }
  
  /**
   * Reset the drawing state
   */
  const resetDrawingState = () => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    distanceTooltipRef.current = null;
  }
  
  /**
   * Set the line's start point
   * @param point - The start point coordinates
   */
  const setStartPoint = (point: Point) => {
    startPointRef.current = new FabricPoint(point.x, point.y);
    setIsDrawing(true);
  }
  
  /**
   * Set the current line reference
   * @param line - The line object
   */
  const setCurrentLine = (line: Line) => {
    currentLineRef.current = line;
  }
  
  /**
   * Set the distance tooltip reference
   * @param tooltip - The text object for the tooltip
   */
  const setDistanceTooltip = (tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }
  
  return {
    isDrawing,
    setIsDrawing,
    isToolInitialized,
    setIsToolInitialized: initializeTool,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    resetDrawingState,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip
  };
};
