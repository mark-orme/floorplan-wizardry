
import { useState, useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';
import { lineToolLogger } from '@/utils/logger';

/**
 * Hook for core line state management
 */
export const useLineStateCore = () => {
  // Drawing state
  const [isActive, setIsActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  /**
   * Initialize the tool
   */
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    setIsActive(true);
    lineToolLogger.debug('Line tool initialized');
  }, []);
  
  /**
   * Reset drawing state
   */
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    lineToolLogger.debug('Drawing state reset');
  }, []);
  
  return {
    // State
    isActive,
    isDrawing,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    shiftKeyPressed,
    inputMethod,
    isPencilMode,
    
    // Setters
    setIsActive,
    setIsDrawing,
    setShiftKeyPressed,
    setInputMethod,
    setIsPencilMode,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    
    // Basic actions
    initializeTool,
    resetDrawingState
  };
};
