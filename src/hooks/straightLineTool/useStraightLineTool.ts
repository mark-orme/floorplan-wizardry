import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { useLineState, InputMethod } from './useLineState';
import { useStraightLineEvents } from './useStraightLineEvents';
import logger from '@/utils/logger';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { toast } from 'sonner';
import { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { calculateMidpoint } from '@/utils/geometry/lineOperations';

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
  const measurementTooltipRef = useRef<Text | null>(null);
  
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

  // Create or update measurement tooltip
  const updateMeasurementTooltip = useCallback((startPoint: Point, endPoint: Point) => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Calculate distance
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Convert to meters (using the grid constant)
      const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
      
      // Calculate midpoint for tooltip position but offset slightly above the line
      const midPoint = calculateMidpoint(startPoint, endPoint);
      const offsetY = 15; // Offset above the line
      
      // Find angle of line to position tooltip correctly
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const isVertical = Math.abs(angle) > 45 && Math.abs(angle) < 135;
      
      // Determine tooltip position - adjust based on line angle
      let tooltipX = midPoint.x;
      let tooltipY = midPoint.y - (isVertical ? 0 : offsetY);
      
      // Adjust position for horizontal/vertical lines to avoid overlap
      if (Math.abs(angle) < 10 || Math.abs(angle) > 170) {
        // Horizontal line - position above
        tooltipY = midPoint.y - offsetY;
      } else if (Math.abs(angle - 90) < 10 || Math.abs(angle + 90) < 10) {
        // Vertical line - position to the right
        tooltipX = midPoint.x + offsetY;
      }
      
      // Create or update tooltip
      if (!measurementTooltipRef.current) {
        measurementTooltipRef.current = new Text(`${distanceInMeters}m`, {
          left: tooltipX,
          top: tooltipY,
          fontSize: 14,
          fill: lineColor,
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: 5,
          objectType: 'measurement',
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center',
          borderColor: 'rgba(0,0,0,0.1)',
          cornerColor: 'transparent',
          cornerSize: 0,
          transparentCorners: true
        });
        canvas.add(measurementTooltipRef.current);
      } else {
        measurementTooltipRef.current.set({
          text: `${distanceInMeters}m`,
          left: tooltipX,
          top: tooltipY,
          fill: lineColor
        });
      }
      
      canvas.renderAll();
      
      return { distance, distanceInMeters };
    } catch (error) {
      reportDrawingError(error, 'tooltip-update', {
        interaction: { type: inputMethod === 'keyboard' ? 'mouse' : inputMethod }
      });
      return null;
    }
  }, [fabricCanvasRef, lineColor, inputMethod, reportDrawingError]);

  // Event handler for pointer down
  const handlePointerDown = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isActive) return;
    
    try {
      // Apply grid snapping immediately to the starting point
      const snappedPoint = snapEnabled ? snapPointToGrid(point) : point;
      
      // Store starting point
      setStartPoint(snappedPoint);
      
      // Create temporary line
      const canvas = fabricCanvasRef.current;
      const line = new Line(
        [snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y],
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
      
      // Initialize measurement tooltip
      updateMeasurementTooltip(snappedPoint, snappedPoint);
      
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
    inputMethod,
    snapEnabled,
    snapPointToGrid,
    updateMeasurementTooltip
  ]);

  // Event handler for pointer move
  const handlePointerMove = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      // Get current pointer position and start point
      const startPoint = startPointRef.current;
      
      // Apply snapping to the end point
      let endPoint = { ...point };
      
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
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
      }
      
      // Apply grid snapping if enabled
      if (snapEnabled) {
        endPoint = snapPointToGrid(endPoint);
      }
      
      // Update line coordinates
      currentLineRef.current.set({
        x2: endPoint.x,
        y2: endPoint.y
      });
      
      // Update the measurement tooltip
      updateMeasurementTooltip(startPoint, endPoint);
      
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
    snapPointToGrid,
    reportDrawingError,
    inputMethod,
    updateMeasurementTooltip
  ]);

  // Event handler for pointer up
  const handlePointerUp = useCallback((point: Point) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentLineRef.current || !startPointRef.current) return;
    
    try {
      const canvas = fabricCanvasRef.current;
      const startPoint = startPointRef.current;
      
      // Apply final snapping to end point
      let endPoint = { ...point };
      
      if (snapEnabled) {
        endPoint = snapPointToGrid(endPoint);
      }
      
      // Apply angle snapping for final position if enabled
      if (snapToAngle) {
        const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * (180 / Math.PI);
        const snappedAngle = Math.round(angle / snapAngleDeg) * snapAngleDeg;
        const distance = Math.sqrt(
          Math.pow(endPoint.x - startPoint.x, 2) + 
          Math.pow(endPoint.y - startPoint.y, 2)
        );
        
        // Calculate new endpoint based on snapped angle
        const radians = snappedAngle * (Math.PI / 180);
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
      }
      
      // Final update to the line
      currentLineRef.current.set({
        x2: endPoint.x,
        y2: endPoint.y,
        selectable: true,
        evented: true
      });
      
      // Calculate final measurements
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only keep the line if it has a meaningful length
      if (distance > 5) {
        // Add metadata for identification
        currentLineRef.current.set('objectType', 'straightLine');
        
        // Convert distance to meters
        const distanceInMeters = (distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
        
        // Add measurement metadata to the line
        currentLineRef.current.set('measurement', `${distanceInMeters}m`);
        
        // Position the measurement tooltip as a permanent label
        if (measurementTooltipRef.current) {
          measurementTooltipRef.current.set({
            selectable: false,
            evented: true,
            objectType: 'measurementLabel'
          });
        }
        
        // Toast success message with distance
        toast.success(`Line drawn: ${distanceInMeters}m`);
      } else {
        // Line too short, remove it
        canvas.remove(currentLineRef.current);
        if (measurementTooltipRef.current) {
          canvas.remove(measurementTooltipRef.current);
        }
      }
      
      // Reset state
      setIsDrawing(false);
      
      // Save state for undo/redo
      if (saveCurrentState) {
        saveCurrentState();
      }
      
      // Trigger canvas update
      canvas.renderAll();
      
      // Optionally trigger change event
      if (onChange) {
        onChange(canvas);
      }
      
      // Reset drawing state
      resetDrawingState();
      measurementTooltipRef.current = null;
      
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
    startPointRef, 
    setIsDrawing, 
    saveCurrentState, 
    onChange, 
    resetDrawingState, 
    logDrawingEvent, 
    setStartPoint,
    reportDrawingError,
    inputMethod,
    snapEnabled,
    snapPointToGrid,
    snapToAngle,
    snapAngleDeg
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
      
      // Remove measurement tooltip if it exists
      if (measurementTooltipRef.current) {
        fabricCanvasRef.current.remove(measurementTooltipRef.current);
        measurementTooltipRef.current = null;
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
    toast.info(snapEnabled ? "Grid snapping disabled" : "Grid snapping enabled");
  }, [toggleSnap, snapEnabled]);

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
      
      // Fix: Add a second argument with context details
      logger.info("Tool initialized", { 
        tool,
        isActive,
        lineColor,
        lineThickness,
        snapToAngle,
        snapAngleDeg,
        inputMethod
      });
      
      // Show toast for grid snapping status
      toast.info(snapEnabled ? "Grid snapping enabled - press G to toggle" : "Grid snapping disabled - press G to toggle", {
        duration: 3000
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
    tool,
    inputMethod,
    snapEnabled
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
