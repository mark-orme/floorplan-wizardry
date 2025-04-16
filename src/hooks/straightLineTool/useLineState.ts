
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineDrawingState } from './useLineDrawingState';
import { useLineCreation } from './useLineCreation';
import { useLineDistance } from './useLineDistance';
import { useLineInputMethod, InputMethod } from './useLineInputMethod';

interface UseLineStateProps {
  fabricCanvasRef: { current: FabricCanvas | null };
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export { InputMethod } from './useLineInputMethod';

export const useLineState = ({
  fabricCanvasRef,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineStateProps) => {
  // Use our modular hooks
  const {
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    snapEnabled,
    anglesEnabled,
    setIsDrawing,
    setIsActive,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    setDistanceTooltip,
    snapPointToGrid,
    toggleSnap,
    toggleAngles,
    initializeTool,
    resetDrawingState
  } = useLineDrawingState();
  
  const {
    inputMethod,
    isPencilMode,
    setInputMethod,
    setIsPencilMode,
    detectInputMethod
  } = useLineInputMethod();
  
  const {
    createLine,
    createDistanceTooltip
  } = useLineCreation();
  
  const {
    calculateDistance,
    updateDistanceTooltip,
    getMidpoint
  } = useLineDistance();
  
  // Start drawing
  const startDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    setIsDrawing(true);
    setIsActive(true);
    setStartPoint(snappedPoint);
    
    // Create the initial line
    const line = createLine(
      canvas,
      snappedPoint.x, 
      snappedPoint.y,
      snappedPoint.x,
      snappedPoint.y,
      lineColor,
      lineThickness
    );
    
    setCurrentLine(line);
    
    // Create initial tooltip (0m distance)
    const tooltip = createDistanceTooltip(canvas, snappedPoint.x, snappedPoint.y, 0);
    setDistanceTooltip(tooltip);
    
    canvas.renderAll();
  }, [
    fabricCanvasRef, 
    snapEnabled, 
    snapPointToGrid, 
    createLine, 
    createDistanceTooltip,
    lineColor, 
    lineThickness, 
    setIsDrawing, 
    setIsActive, 
    setStartPoint, 
    setCurrentLine, 
    setDistanceTooltip
  ]);
  
  // Continue drawing
  const continueDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update the current point
    setCurrentPoint(snappedPoint);
    
    // Update the line
    currentLine.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    // Calculate distance
    const distance = calculateDistance(startPoint, snappedPoint);
    
    // Update the tooltip
    if (distanceTooltip) {
      updateDistanceTooltip(distanceTooltip, startPoint, snappedPoint, distance);
    }
    
    canvas.renderAll();
  }, [
    fabricCanvasRef, 
    isDrawing, 
    startPoint, 
    currentLine, 
    distanceTooltip, 
    snapEnabled, 
    snapPointToGrid, 
    calculateDistance, 
    updateDistanceTooltip,
    setCurrentPoint
  ]);
  
  // Complete drawing
  const completeDrawing = useCallback((point: Point) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isDrawing || !startPoint || !currentLine) return;
    
    // Apply snapping if enabled
    const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
    
    // Update the line's final position
    currentLine.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y,
      selectable: true,
      evented: true
    });
    
    // Calculate the distance
    const distance = calculateDistance(startPoint, snappedPoint);
    
    // If the line is too short, remove it
    if (distance < 5) {
      canvas.remove(currentLine);
      if (distanceTooltip) canvas.remove(distanceTooltip);
    } else {
      // Save current state for undo
      saveCurrentState();
      
      // Update the tooltip's final position
      if (distanceTooltip) {
        const midpoint = getMidpoint(startPoint, snappedPoint);
        
        // Convert distance to meters (assuming 100px = 1m)
        const meters = (distance / 100).toFixed(1);
        
        distanceTooltip.set({
          text: `${meters}m`,
          left: midpoint.x,
          top: midpoint.y - 10,
          selectable: false,
          evented: true
        });
      }
    }
    
    // Reset drawing state
    resetDrawingState();
    
    canvas.renderAll();
  }, [
    fabricCanvasRef, 
    isDrawing, 
    startPoint, 
    currentLine, 
    distanceTooltip, 
    snapEnabled, 
    snapPointToGrid, 
    saveCurrentState,
    calculateDistance,
    getMidpoint,
    resetDrawingState
  ]);
  
  // Cancel drawing
  const cancelDrawing = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !currentLine) return;
    
    // Remove the current line and tooltip
    canvas.remove(currentLine);
    if (distanceTooltip) canvas.remove(distanceTooltip);
    
    // Reset drawing state
    resetDrawingState();
    
    canvas.renderAll();
  }, [
    fabricCanvasRef, 
    currentLine, 
    distanceTooltip,
    resetDrawingState
  ]);
  
  return {
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    initializeTool,
    resetDrawingState,
    setInputMethod,
    setIsPencilMode,
    toggleSnap,
    toggleAngles,
    createLine,
    createDistanceTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing
  };
};
