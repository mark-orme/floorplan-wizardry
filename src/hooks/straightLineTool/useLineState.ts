
/**
 * State management hook for straight line drawing tool
 * @module hooks/straightLineTool/useLineState
 */
import { useState, useRef, useCallback } from 'react';
import { Line, Text } from 'fabric';
import { Point } from '@/types/core/Geometry';

/**
 * Interface for straight line tool state
 */
export interface LineState {
  /** Whether currently drawing a line */
  isDrawing: boolean;
  /** Whether the tool is initialized */
  isToolInitialized: boolean;
  /** Reference to the starting point */
  startPointRef: React.MutableRefObject<Point | null>;
  /** Reference to the current line */
  currentLineRef: React.MutableRefObject<Line | null>;
  /** Reference to the distance tooltip */
  distanceTooltipRef: React.MutableRefObject<Text | null>;
  /** Set the start point for line drawing */
  setStartPoint: (point: Point) => void;
  /** Set the current line object */
  setCurrentLine: (line: Line) => void;
  /** Set the tooltip for showing distance */
  setDistanceTooltip: (tooltip: Text) => void;
  /** Initialize the tool */
  initializeTool: () => void;
  /** Reset drawing state */
  resetDrawingState: () => void;
}

/**
 * Custom hook for managing straight line tool state
 * @returns State and methods for line drawing
 */
export const useLineState = (): LineState => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<Text | null>(null);

  /**
   * Sets the start point and activates drawing
   * @param point - Starting point for the line
   */
  const setStartPoint = useCallback((point: Point) => {
    startPointRef.current = point;
    setIsDrawing(true);
  }, []);

  /**
   * Sets the current line being drawn
   * @param line - Line object
   */
  const setCurrentLine = useCallback((line: Line) => {
    currentLineRef.current = line;
  }, []);

  /**
   * Sets the distance tooltip
   * @param tooltip - Text object showing distance
   */
  const setDistanceTooltip = useCallback((tooltip: Text) => {
    distanceTooltipRef.current = tooltip;
  }, []);

  /**
   * Initializes the line tool
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
  }, []);

  /**
   * Resets the drawing state
   */
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
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    initializeTool,
    resetDrawingState
  };
};
