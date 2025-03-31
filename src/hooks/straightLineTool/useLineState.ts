
/**
 * Hooks for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */

import { useRef, useState, useCallback } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Interface for the return type of useLineState hook
 * @interface LineStateHookResult
 */
interface LineStateHookResult {
  /** Whether a line is currently being drawn */
  isDrawing: boolean;
  
  /** Function to set drawing state */
  setIsDrawing: (isDrawing: boolean) => void;
  
  /** Whether the tool has been properly initialized */
  isToolInitialized: boolean;
  
  /** Reference to the start point of the current line */
  startPointRef: React.MutableRefObject<Point | null>;
  
  /** Reference to the current line being drawn */
  currentLineRef: React.MutableRefObject<Line | null>;
  
  /** Reference to the tooltip showing distance measurement */
  distanceTooltipRef: React.MutableRefObject<Text | null>;
  
  /** Function to set the start point of a line */
  setStartPoint: (point: Point) => void;
  
  /** Function to set the current line being drawn */
  setCurrentLine: (line: Line) => void;
  
  /** Function to set the distance measurement tooltip */
  setDistanceTooltip: (tooltip: Text) => void;
  
  /** Function to initialize the tool */
  initializeTool: () => void;
  
  /** Function to reset all drawing state */
  resetDrawingState: () => void;
}

/**
 * Hook to manage state for straight line drawing
 * Maintains references to the current line, start point, and tooltip
 * to prevent unnecessary re-renders while drawing
 * 
 * @returns {LineStateHookResult} Object containing line drawing state and functions
 */
export const useLineState = (): LineStateHookResult => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // References to avoid re-renders
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);
  
  /**
   * Set start point for line
   * @param {Point} point - The starting point coordinates
   */
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
    setIsDrawing(true);
  }, []);
  
  /**
   * Set current line object
   * @param {Line} line - The line object being drawn
   */
  const setCurrentLine = useCallback((line: Line) => {
    currentLineRef.current = line;
  }, []);
  
  /**
   * Set distance tooltip
   * @param {Text} tooltip - The tooltip fabric object
   */
  const setDistanceTooltip = useCallback((tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  /**
   * Initialize tool
   * Sets the tool initialized state to true
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
  }, []);
  
  /**
   * Reset drawing state
   * Clears all current drawing references and sets drawing state to false
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
