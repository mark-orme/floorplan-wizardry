
import { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { toast } from 'sonner';
import { InputMethod } from './useLineInputMethod';
import { MeasurementData, UseStraightLineToolProps } from './useStraightLineTool.d';
import { useLineToolState } from './useLineToolState';

/**
 * Hook for implementing a straight line drawing tool
 * @param props Tool configuration
 * @returns Tool controls and state
 */
export const useStraightLineTool = (props: UseStraightLineToolProps) => {
  // Extract props with defaults
  const {
    enabled = false,
    isEnabled = enabled,
    isActive = true,
    canvas,
    lineColor,
    lineThickness,
    shiftKeyPressed = false,
    saveCurrentState = () => {}
  } = props;

  // Initialize state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });

  // Get line tool state from useLineToolState hook
  const {
    lineState,
    startLine,
    updateLine,
    completeLine,
    cancelLine,
    clearLines
  } = useLineToolState({
    snapToGrid: snapEnabled,
    gridSize: 20
  });

  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  // Toggle angle snapping
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  // Toggle all snapping
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
    setAnglesEnabled(prev => !prev);
  }, []);

  // Start drawing a line
  const startDrawing = useCallback((point: Point) => {
    if (!isEnabled || !isActive) return;
    
    setIsDrawing(true);
    
    // Initialize the line with the start point
    startLine(point);
    
    // Create fabric line object
    if (canvas) {
      const startPoint = point;
      
      if (currentLine) {
        canvas.remove(currentLine);
      }
      
      const newLine = new Line(
        [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
        {
          stroke: lineColor,
          strokeWidth: lineThickness,
          selectable: false
        }
      );
      
      canvas.add(newLine);
      setCurrentLine(newLine);
      canvas.renderAll();
    }
  }, [isEnabled, isActive, canvas, lineColor, lineThickness, currentLine, startLine]);

  // Continue drawing line (update end point)
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !isEnabled || !isActive) return;
    
    updateLine(point);
    
    // Update the fabric line object
    if (canvas && currentLine && lineState.points[0]) {
      const startPoint = lineState.points[0];
      
      currentLine.set({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: point.x,
        y2: point.y
      });
      
      canvas.renderAll();
      
      // Update measurement data
      const dx = point.x - startPoint.x;
      const dy = point.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      setMeasurementData({
        distance,
        angle,
        snapped: snapEnabled,
        unit: 'px'
      });
    }
  }, [isDrawing, isEnabled, isActive, canvas, currentLine, lineState.points, updateLine, snapEnabled]);

  // Complete drawing the line
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !isEnabled || !isActive) return;
    
    if (canvas && currentLine) {
      // Make line selectable after drawing
      currentLine.set({
        selectable: true,
        evented: true
      });
      
      canvas.setActiveObject(currentLine);
      canvas.renderAll();
      
      // Save canvas state
      saveCurrentState();
      
      // Show success toast
      toast.success('Line created successfully');
    }
    
    // Complete line in the state
    completeLine();
    setIsDrawing(false);
  }, [isDrawing, isEnabled, isActive, canvas, currentLine, completeLine, saveCurrentState]);

  // End drawing (same as complete but without a specific point)
  const endDrawing = useCallback(() => {
    if (!isDrawing || !lineState.points[1]) return;
    
    completeDrawing(lineState.points[1]);
  }, [isDrawing, lineState.points, completeDrawing]);

  // Cancel the current line
  const cancelDrawing = useCallback(() => {
    if (canvas && currentLine) {
      canvas.remove(currentLine);
      canvas.renderAll();
      
      // Show toast for cancellation
      toast.warning('Line drawing canceled');
    }
    
    cancelLine();
    setIsDrawing(false);
    setCurrentLine(null);
  }, [canvas, currentLine, cancelLine]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled || !isActive) return;
    
    if (event.key === 'Escape') {
      cancelDrawing();
    } else if (event.key === 'Enter' && isDrawing) {
      endDrawing();
    }
  }, [isEnabled, isActive, cancelDrawing, endDrawing, isDrawing]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Handle key up events if needed
  }, []);

  // Handle pointer events
  const handlePointerDown = useCallback((event: any) => {
    if (!isEnabled || !isActive) return;
    
    const pointer = canvas?.getPointer(event.e);
    if (!pointer) return;
    
    startDrawing({ x: pointer.x, y: pointer.y });
  }, [isEnabled, isActive, canvas, startDrawing]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isEnabled || !isActive || !isDrawing) return;
    
    const pointer = canvas?.getPointer(event.e);
    if (!pointer) return;
    
    continueDrawing({ x: pointer.x, y: pointer.y });
  }, [isEnabled, isActive, isDrawing, canvas, continueDrawing]);

  const handlePointerUp = useCallback((event: any) => {
    if (!isEnabled || !isActive || !isDrawing) return;
    
    const pointer = canvas?.getPointer(event.e);
    if (!pointer) return;
    
    completeDrawing({ x: pointer.x, y: pointer.y });
  }, [isEnabled, isActive, isDrawing, canvas, completeDrawing]);

  // Render tooltip for measurements
  const renderTooltip = useCallback(() => {
    // Simple implementation - in a real app, you might want to use a React portal
    return null;
  }, []);

  // Set input method (mouse, touch, etc)
  const setInputMethod = useCallback((method: InputMethod) => {
    // Implementation for tracking input method
  }, []);

  return {
    isActive,
    isEnabled,
    currentLine,
    isToolInitialized: true,
    isDrawing,
    inputMethod: InputMethod.MOUSE,
    isPencilMode: false,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    toggleSnap,
    startDrawing,
    continueDrawing,
    endDrawing,
    completeDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    renderTooltip,
    setInputMethod,
    shiftKeyPressed,
    setCurrentLine,
    saveCurrentState
  };
};
