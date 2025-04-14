import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { useLineState, InputMethod } from './useLineState';
import { useStraightLineEvents } from './useStraightLineEvents';
import logger from '@/utils/logger';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { toast } from 'sonner';
import { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';

interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  snapToAngle?: boolean;
  snapAngleDeg?: number;
  saveCurrentState?: () => void;
  onChange?: (canvas: FabricCanvas) => void;
}

/**
 * Hook for using the straight line drawing tool
 */
export const useStraightLineTool = ({
  fabricCanvasRef,
  tool,
  lineColor = '#000000',
  lineThickness = 2,
  snapToAngle = false,
  snapAngleDeg = 45,
  saveCurrentState = () => {},
  onChange
}: UseStraightLineToolProps) => {
  // Track if the tool is active
  const isActive = tool === DrawingMode.STRAIGHT_LINE || tool === DrawingMode.LINE;

  // References
  const isToolInitializedRef = useRef<boolean>(false);
  
  // Use the shared line state
  const {
    isDrawing,
    isToolInitialized,
    setIsDrawing,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    initializeTool,
    resetDrawingState,
    snapEnabled,
    snapPointToGrid,
    snapLineToGrid,
    inputMethod,
    isPencilMode,
    toggleSnap
  } = useLineState({
    fabricCanvasRef,
    lineThickness,
    lineColor
  });

  // Get the error reporting hook
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();

  // Event handler for pointer down
  const handlePointerDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isActive) return;
    
    try {
      // Store starting point
      setStartPoint(point);
      
      // Create temporary line
      const canvas = fabricCanvasRef.current;
      const line = new Line(
        [point.x, point.y, point.x, point.y],
        {
          strokeWidth: lineThickness,
          stroke: lineColor,
          selectable: false,
          evented: false,
          strokeLineCap: 'round',
          strokeLineJoin: 'round'
        }
      );
      
      // Add to canvas
      canvas.add(line);
      setCurrentLine(line);
      
      // Set drawing state
      setIsDrawing(true);
      
      // Log event
      logDrawingEvent('Line drawing started', 'line-start', {
        interaction: { 
          type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
        }
      });
    } catch (error) {
      reportDrawingError(error, 'line-pointer-down', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isActive, 
    setStartPoint, 
    lineThickness, 
    lineColor, 
    setCurrentLine, 
    setIsDrawing, 
    logDrawingEvent, 
    reportDrawingError,
    inputMethod
  ]);

  // Event handler for pointer move
  const handlePointerMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      // Get current pointer position and start point
      const startPoint = startPointRef.current;
      
      // Update line end point
      currentLineRef.current.set({
        x2: point.x,
        y2: point.y
      });
      
      // Apply angle snapping if enabled
      if (snapToAngle) {
        const angle = Math.atan2(point.y - startPoint.y, point.x - startPoint.x) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(
          Math.pow(point.x - startPoint.x, 2) + 
          Math.pow(point.y - startPoint.y, 2)
        );
        
        // Calculate new endpoint based on snapped angle
        const radians = snappedAngle * (Math.PI / 180);
        currentLineRef.current.set({
          x2: startPoint.x + distance * Math.cos(radians),
          y2: startPoint.y + distance * Math.sin(radians)
        });
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled && currentLineRef.current) {
        snapLineToGrid(currentLineRef.current);
      }
      
      // Render changes
      fabricCanvasRef.current.renderAll();
    } catch (error) {
      reportDrawingError(error, 'line-pointer-move', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    startPointRef, 
    snapToAngle, 
    snapAngleDeg, 
    snapEnabled, 
    snapLineToGrid,
    reportDrawingError,
    inputMethod
  ]);

  // Event handler for pointer up
  const handlePointerUp = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current) return;
    
    try {
      // Update the endpoint one last time
      handlePointerMove(point);
      
      // Finalize the line
      currentLineRef.current.set({
        selectable: true,
        evented: true
      });
      
      // Add metadata for identification
      currentLineRef.current.set('objectType', 'straightLine');
      
      // Reset state
      setIsDrawing(false);
      
      // Save state for undo/redo
      if (saveCurrentState) {
        saveCurrentState();
      }
      
      // Trigger canvas update
      fabricCanvasRef.current.renderAll();
      
      // Optionally trigger change event
      if (onChange) {
        onChange(fabricCanvasRef.current);
      }
      
      // Reset drawing state
      resetDrawingState();
      
      // Log event
      logDrawingEvent('Line drawing completed', 'line-complete', {
        interaction: { 
          type: inputMethod === 'keyboard' ? 'mouse' : inputMethod
        }
      });
      
      setStartPoint(null);
      
    } catch (error) {
      reportDrawingError(error, 'line-pointer-up', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    handlePointerMove, 
    setIsDrawing, 
    saveCurrentState, 
    onChange, 
    resetDrawingState, 
    logDrawingEvent, 
    setStartPoint,
    reportDrawingError,
    inputMethod
  ]);

  // Use our event handlers hook
  const {
    handleFabricMouseDown,
    handleFabricMouseMove,
    handleFabricMouseUp
  } = useStraightLineEvents({
    fabricCanvasRef,
    isActive,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    inputMethod
  });

  // Cancel drawing (e.g. on Escape key)
  const cancelDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing) return;
    
    try {
      // Remove temporary line
      if (currentLineRef.current) {
        fabricCanvasRef.current.remove(currentLineRef.current);
      }
      
      // Remove distance tooltip if it exists
      if (distanceTooltipRef.current) {
        fabricCanvasRef.current.remove(distanceTooltipRef.current);
      }
      
      // Reset state
      setIsDrawing(false);
      
      // Reset drawing state
      resetDrawingState();
      
      // Render changes
      fabricCanvasRef.current.renderAll();
      
      // Log event
      logDrawingEvent('Line drawing cancelled', 'line-cancel', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
      
      toast.info("Line drawing cancelled");
    } catch (error) {
      reportDrawingError(error, 'line-cancel', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
    }
  }, [
    fabricCanvasRef, 
    isDrawing, 
    currentLineRef, 
    distanceTooltipRef, 
    setIsDrawing, 
    resetDrawingState, 
    logDrawingEvent,
    reportDrawingError,
    inputMethod
  ]);

  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
  }, [toggleSnap]);

  // Use the keyboard shortcuts hook
  const { handleKeyDown } = useLineKeyboardShortcuts({
    isActive,
    isDrawing,
    cancelDrawing,
    toggleGridSnapping,
    tool
  });

  // Set up canvas event handlers when tool becomes active
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    // Only set up handlers when tool is active
    if (!isActive) {
      isToolInitializedRef.current = false;
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Initialize tool if needed
    if (!isToolInitializedRef.current) {
      initializeTool();
      isToolInitializedRef.current = true;
      
      logger.info("Straight line tool initialized", { 
        canvas, 
        tool,
        isActive,
        lineColor,
        lineThickness,
        snapToAngle,
        snapAngleDeg
      });
    }
    
    // Add fabric canvas event listeners
    canvas.on('mouse:down', handleFabricMouseDown);
    canvas.on('mouse:move', handleFabricMouseMove);
    canvas.on('mouse:up', handleFabricMouseUp);
    
    // Handle escape key to cancel drawing
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function
    return () => {
      canvas.off('mouse:down', handleFabricMouseDown);
      canvas.off('mouse:move', handleFabricMouseMove);
      canvas.off('mouse:up', handleFabricMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    fabricCanvasRef, 
    isActive, 
    isDrawing, 
    initializeTool, 
    handleFabricMouseDown, 
    handleFabricMouseMove, 
    handleFabricMouseUp, 
    handleKeyDown,
    lineColor,
    lineThickness,
    snapToAngle,
    snapAngleDeg,
    tool
  ]);

  // Return the hook API
  return {
    // State
    isActive,
    isDrawing,
    isToolInitialized: isToolInitializedRef.current,
    snapEnabled,
    inputMethod,
    isPencilMode,
    
    // Methods for direct manipulation
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelDrawing,
    toggleGridSnapping
  };
};
