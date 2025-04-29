
// Import necessary hooks and utilities
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from './useStraightLineTool.d';
import { useLineInputMethod, InputMethod } from './useLineInputMethod';
import { useLineEvents } from './useLineEvents';
import { useLineDrawingState } from './useLineDrawingState';
import { useLineInitialization } from './useLineInitialization';
import { useLineDistance } from './useLineDistance';
import { useLineKeyboardShortcuts } from './useLineKeyboardShortcuts';
import { useLinePreview } from './useLinePreview';
import { useLineToolResult } from './useLineToolResult';
import { toolsLogger } from '@/utils/logger';
import { DrawingMode } from '@/types/drawingTypes';

// Export the MeasurementData type for consumers
export type { MeasurementData } from './useStraightLineTool.d';

/**
 * Hook for the straight line drawing tool
 */
export const useStraightLineTool = ({
  isEnabled = false,
  isActive = false,
  canvas,
  lineColor = '#000000',
  lineThickness = 2,
  shiftKeyPressed = false,
  saveCurrentState = () => {}
}) => {
  // Initialize state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: 0, 
    angle: 0,
    startPoint: { x: 0, y: 0 },
    endPoint: { x: 0, y: 0 },
    snapped: false,
    unit: 'px'
  });
  
  // Initialize refs
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const tooltipRef = useRef<Text | null>(null);
  
  // Use line hooks
  const { isDrawing, startPoint, currentPoint, currentLine, setIsDrawing, setStartPoint, setCurrentPoint, setCurrentLine, resetDrawingState } = useLineDrawingState();
  const { isActive: isToolActive, initializeTool, lineRef } = useLineInitialization();
  const { getInputMethod, InputMethod } = useLineInputMethod();
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const { calculateDistance, updateDistanceTooltip, getMidpoint } = useLineDistance();
  const { getLinePreview } = useLinePreview();
  
  // Initialize tool when enabled
  useEffect(() => {
    if (isEnabled && !isToolActive) {
      initializeTool();
    }
  }, [isEnabled, isToolActive, initializeTool]);
  
  // Update input method
  const updateInputMethod = useCallback((pointerType: string) => {
    if (pointerType === 'pen' || pointerType === 'stylus') {
      setInputMethod(InputMethod.PENCIL);
    } else if (pointerType === 'touch') {
      setInputMethod(InputMethod.TOUCH);
    } else {
      setInputMethod(InputMethod.MOUSE);
    }
  }, []);
  
  // Handle starting a line drawing
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setStartPoint(point);
    startPointRef.current = point;
    
    if (canvas) {
      // Create line on canvas
      const line = new Line([point.x, point.y, point.x, point.y], {
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      canvas.renderAll();
      
      setCurrentLine(line);
      currentLineRef.current = line;
      lineRef.current = line;
    }
    
    toolsLogger.debug('Started drawing at', point);
  }, [canvas, lineColor, lineThickness, setIsDrawing, setStartPoint, setCurrentLine]);
  
  // Handle continuing line drawing
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    setCurrentPoint(point);
    
    // Apply line preview with snapping
    const preview = getLinePreview(startPoint, point, snapEnabled, anglesEnabled, shiftKeyPressed);
    
    // Update line on canvas
    if (canvas && currentLine) {
      currentLine.set({
        x2: preview.endPoint.x,
        y2: preview.endPoint.y
      });
      canvas.renderAll();
    }
    
    // Update measurement data
    if (startPoint) {
      const distance = calculateDistance(startPoint, preview.endPoint);
      const dx = preview.endPoint.x - startPoint.x;
      const dy = preview.endPoint.y - startPoint.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      setMeasurementData({
        distance,
        angle,
        startPoint,
        endPoint: preview.endPoint,
        snapped: preview.isSnapped,
        unit: 'px',
        snapType: preview.snapType
      });
      
      // Update distance tooltip
      if (tooltipRef.current) {
        const midpoint = getMidpoint(startPoint, preview.endPoint);
        updateDistanceTooltip(tooltipRef.current, startPoint, preview.endPoint, distance);
      }
    }
  }, [
    isDrawing, 
    startPoint, 
    currentLine, 
    canvas, 
    snapEnabled, 
    anglesEnabled, 
    shiftKeyPressed,
    setCurrentPoint, 
    getLinePreview,
    calculateDistance,
    getMidpoint,
    updateDistanceTooltip
  ]);
  
  // Handle completing line drawing
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint || !currentLine) return;
    
    // Apply final snapping
    const preview = getLinePreview(startPoint, point, snapEnabled, anglesEnabled, shiftKeyPressed);
    
    // Finalize line
    if (canvas && currentLine) {
      currentLine.set({
        x2: preview.endPoint.x,
        y2: preview.endPoint.y,
        selectable: true,
        evented: true
      });
      canvas.renderAll();
      
      // Store final measurements
      const distance = calculateDistance(startPoint, preview.endPoint);
      const dx = preview.endPoint.x - startPoint.x;
      const dy = preview.endPoint.y - startPoint.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      setMeasurementData({
        distance,
        angle,
        startPoint,
        endPoint: preview.endPoint,
        snapped: preview.isSnapped,
        unit: 'px',
        snapType: preview.snapType
      });
      
      // Remove tooltip if exists
      if (tooltipRef.current) {
        canvas.remove(tooltipRef.current);
        tooltipRef.current = null;
      }
      
      // Save canvas state
      saveCurrentState();
    }
    
    // Reset drawing state
    resetDrawingState();
    toolsLogger.debug('Completed drawing');
  }, [
    isDrawing, 
    startPoint, 
    currentLine, 
    canvas, 
    snapEnabled, 
    anglesEnabled, 
    shiftKeyPressed,
    resetDrawingState,
    getLinePreview,
    calculateDistance,
    saveCurrentState
  ]);
  
  // Handle cancelling line drawing
  const cancelDrawing = useCallback(() => {
    if (canvas && currentLine) {
      canvas.remove(currentLine);
      canvas.renderAll();
    }
    
    if (tooltipRef.current && canvas) {
      canvas.remove(tooltipRef.current);
      tooltipRef.current = null;
    }
    
    resetDrawingState();
    toolsLogger.debug('Drawing cancelled');
  }, [canvas, currentLine, resetDrawingState]);
  
  // Toggle grid snapping
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angle snapping
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Use line events hook
  const lineState = { 
    isDrawing, 
    startPoint, 
    startDrawing, 
    continueDrawing, 
    completeDrawing,
    cancelDrawing 
  };
  
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown } = useLineEvents({
    canvas,
    lineState,
    snapEnabled,
    anglesEnabled,
    updateMeasurementData: setMeasurementData
  });
  
  // Set up keyboard shortcuts
  useLineKeyboardShortcuts({
    isActive: isEnabled,
    isDrawing,
    cancelDrawing,
    toggleGridSnapping: toggleSnap,
    toggleAngles,
    tool: 'line' as DrawingMode
  });
  
  // Handle pointer events
  const handlePointerDown = useCallback((event: any) => {
    if (!isEnabled) return;
    return handleMouseDown(event);
  }, [isEnabled, handleMouseDown]);
  
  const handlePointerMove = useCallback((event: any) => {
    if (!isEnabled) return;
    return handleMouseMove(event);
  }, [isEnabled, handleMouseMove]);
  
  const handlePointerUp = useCallback((event: any) => {
    if (!isEnabled) return;
    return handleMouseUp(event);
  }, [isEnabled, handleMouseUp]);
  
  // Function to render tooltip (stub implementation)
  const renderTooltip = useCallback(() => {
    return null; // Implement actual tooltip rendering as needed
  }, []);
  
  // Create the final hook result
  return useLineToolResult({
    isDrawing,
    enabled: isEnabled && isActive,
    inputMethod,
    snapEnabled,
    startPointRef,
    currentLineRef,
    toggleSnap,
    toggleAngles,
    cancelDrawing,
    renderTooltip,
    startDrawing,
    continueDrawing,
    completeDrawing,
    measurementData: {
      distance: measurementData.distance,
      angle: measurementData.angle,
      snapped: measurementData.snapped,
      unit: measurementData.unit
    }
  });
};
