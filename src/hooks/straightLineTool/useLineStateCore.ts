
import { useState, useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';

/**
 * Core state for line tool operations
 */
export const useLineStateCore = () => {
  // Active state
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    setIsActive(true);
  }, []);
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
  }, []);
  
  return {
    // Active state
    isActive,
    isToolInitialized,
    setIsActive,
    initializeTool,
    
    // Drawing state
    isDrawing,
    startPoint,
    currentPoint,
    currentLine,
    setIsDrawing,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    resetDrawingState,
    
    // Input method state
    inputMethod,
    isPencilMode,
    shiftKeyPressed,
    setInputMethod,
    setIsPencilMode,
    setShiftKeyPressed
  };
};
