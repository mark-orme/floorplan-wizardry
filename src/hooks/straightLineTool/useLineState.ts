import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineStateCore } from './useLineStateCore';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLineAngleSnap } from './useLineAngleSnap';
import { useLineDrawing } from './useLineDrawing';

export interface UseLineStateOptions {
  canvas: FabricCanvas | null;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

/**
 * Hook for managing the state of the line tool
 */
export const useLineState = ({
  canvas,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineStateOptions) => {
  const { isDrawing, setIsDrawing, startPoint, setStartPoint, currentPoint, setCurrentPoint } = 
    useLineStateCore();
  
  const { snapEnabled, toggleGridSnapping, snapToGrid } = 
    useEnhancedGridSnapping();
  
  const { anglesEnabled, toggleAngles, snapToAngle } = 
    useLineAngleSnap();
  
  const { createLine, updateLine, finalizeLine, removeLine } = 
    useLineDrawing(canvas, { lineColor, lineThickness });
  
  // Keep track of the current line
  const currentLineRef = useRef<any>(null);
  
  /**
   * Start drawing a line
   */
  const startDrawing = useCallback((point: Point) => {
    const snappedPoint = snapToGrid(point);
    setStartPoint(snappedPoint);
    setCurrentPoint(snappedPoint);
    setIsDrawing(true);
    
    // Create the initial line
    currentLineRef.current = createLine(snappedPoint, snappedPoint);
  }, [createLine, setIsDrawing, setStartPoint, setCurrentPoint, snapToGrid]);
  
  /**
   * Update the line while drawing
   */
  const updateLine = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // Apply snapping if enabled
    let snappedPoint = snapToGrid(point);
    
    // Apply angle snapping if enabled
    if (anglesEnabled && startPoint) {
      snappedPoint = snapToAngle(startPoint, snappedPoint);
    }
    
    setCurrentPoint(snappedPoint);
    
    // Update the line on the canvas
    if (currentLineRef.current) {
      updateLine(currentLineRef.current, startPoint, snappedPoint);
    }
  }, [isDrawing, startPoint, updateLine, snapToGrid, snapToAngle, anglesEnabled, setCurrentPoint]);
  
  /**
   * Finish drawing a line
   */
  const finishDrawing = useCallback(() => {
    if (!isDrawing || !startPoint || !currentPoint) return null;
    
    // Finalize the line
    const finalLine = finalizeLine(currentLineRef.current, startPoint, currentPoint);
    
    // Save the current state for undo functionality
    saveCurrentState();
    
    // Reset the drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    currentLineRef.current = null;
    
    return finalLine;
  }, [isDrawing, startPoint, currentPoint, finalizeLine, saveCurrentState, setIsDrawing, setStartPoint, setCurrentPoint]);
  
  /**
   * Cancel the current drawing operation
   */
  const cancelDrawing = useCallback(() => {
    if (currentLineRef.current) {
      removeLine(currentLineRef.current);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    currentLineRef.current = null;
  }, [removeLine, setIsDrawing, setStartPoint, setCurrentPoint]);

  return {
    start: startPoint,
    end: currentPoint,
    isDrawing,
    startDrawing,
    updateLine,
    finishDrawing,
    cancelDrawing,
    snapEnabled,
    toggleSnapToGrid: toggleGridSnapping,
    anglesEnabled,
    toggleSnapToAngles: toggleAngles,
    snapToGrid,
    snapToAngle
  };
};

export default useLineState;
