
import { useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from './useLineInputMethod';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLineAngleSnap } from './useLineAngleSnap';
import { useLineDrawing } from './useLineDrawing';
import { lineToolLogger } from '@/utils/logger';

interface UseLineStateOptions {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing line tool state
 */
export const useLineState = ({ 
  fabricCanvasRef, 
  lineColor, 
  lineThickness,
  saveCurrentState 
}: UseLineStateOptions) => {
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
  
  // Grid and angle snapping
  const { snapEnabled, toggleGridSnapping: toggleSnap, snapToGrid } = useEnhancedGridSnapping({
    initialSnapEnabled: true
  });
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const { snapToAngle } = useLineAngleSnap({ enabled: true });

  // Use line drawing hooks
  const { createLine, updateLine, finalizeLine, removeLine } = useLineDrawing(
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  );
  
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
  
  /**
   * Start drawing at a point
   */
  const startDrawing = useCallback((point: Point) => {
    setIsActive(true);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    
    // Create initial line
    const line = createLine(point.x, point.y, point.x, point.y);
    if (line) {
      setCurrentLine(line);
      lineToolLogger.debug('Started drawing line', { startPoint: point });
    }
  }, [createLine]);
  
  /**
   * Continue drawing to a point
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    let endPoint = point;
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled && startPoint) {
      endPoint = snapToAngle(startPoint, endPoint);
    }
    
    // Update current point
    setCurrentPoint(endPoint);
    
    // Update line
    updateLine(currentLine, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  }, [isDrawing, startPoint, currentLine, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, updateLine]);
  
  /**
   * Complete drawing at a point
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    let endPoint = point;
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled && startPoint) {
      endPoint = snapToAngle(startPoint, endPoint);
    }
    
    // Finalize line
    finalizeLine(currentLine, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    lineToolLogger.debug('Completed drawing line', { 
      startPoint, 
      endPoint,
      lineId: (currentLine as any).id || 'unknown'
    });
    
    // Reset drawing state
    resetDrawingState();
  }, [isDrawing, startPoint, currentLine, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, finalizeLine, resetDrawingState]);
  
  /**
   * Cancel drawing
   */
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !currentLine) return;
    
    // Remove the current line
    removeLine(currentLine);
    lineToolLogger.debug('Drawing cancelled');
    
    // Reset drawing state
    resetDrawingState();
  }, [isDrawing, currentLine, removeLine, resetDrawingState]);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => {
      const newValue = !prev;
      lineToolLogger.debug(`Angle constraints ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
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
    snapEnabled,
    anglesEnabled,
    
    // Setters
    setIsActive,
    setIsDrawing,
    setShiftKeyPressed,
    setInputMethod,
    setIsPencilMode,
    
    // Actions
    initializeTool,
    resetDrawingState,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    toggleSnap,
    toggleAngles
  };
};
