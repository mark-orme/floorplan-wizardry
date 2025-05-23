
import { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point, isValidPoint, pointsEqual } from '@/types/core/Point';
import { MeasurementData } from './useStraightLineTool.d';
import { toolsLogger } from '@/utils/logger';
import { toast } from 'sonner';

// Add null safety to this function
const calculateDistance = (p1: Point | null, p2: Point | null): number | null => {
  if (!p1 || !p2) return null;
  
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Add null safety to this function
const calculateAngle = (p1: Point | null, p2: Point | null): number | null => {
  if (!p1 || !p2) return null;
  
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
};

export const useStraightLineTool = ({ 
  enabled = false,
  canvas,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {}
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });
  
  // Activate the tool when enabled changes
  useEffect(() => {
    setIsActive(enabled);
  }, [enabled]);
  
  // Calculate and update measurements
  useEffect(() => {
    if (!startPoint || !currentPoint) return;
    
    // Calculate distance between points
    const distance = calculateDistance(startPoint, currentPoint);
    
    // Calculate angle
    const angle = calculateAngle(startPoint, currentPoint);
    
    // Check if point should be snapped
    const snapX = snapEnabled && Math.abs(startPoint.x - currentPoint.x) < 5;
    const snapY = snapEnabled && Math.abs(startPoint.y - currentPoint.y) < 5;
    
    // Create a new measurement data object
    setMeasurementData(prev => ({
      ...prev,
      distance,
      angle,
      snapped: snapX || snapY
    }));
  }, [startPoint, currentPoint, snapEnabled]);
  
  // Function to handle starting a line drawing
  const startDrawing = useCallback((point: Point) => {
    if (!canvas || !enabled) return;
    
    setIsDrawing(true);
    setStartPoint(point);
    startPointRef.current = point;
    
    // Create a new line
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    canvas.renderAll();
    currentLineRef.current = line;
    
    toolsLogger.debug('Drawing started', { point });
  }, [canvas, enabled, lineColor, lineThickness]);
  
  // Function to update the line while drawing
  const continueDrawing = useCallback((point: Point) => {
    if (!canvas || !isDrawing || !startPoint || !currentLineRef.current) return;
    
    setCurrentPoint(point);
    
    // Local snap logic
    let snappedPoint = { ...point };
    if (snapEnabled) {
      // X-axis snap
      if (Math.abs(startPoint.x - point.x) < 10) {
        snappedPoint.x = startPoint.x;
      }
      
      // Y-axis snap
      if (Math.abs(startPoint.y - point.y) < 10) {
        snappedPoint.y = startPoint.y;
      }
    }
    
    // Update the line
    currentLineRef.current.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    canvas.renderAll();
  }, [canvas, isDrawing, startPoint, snapEnabled]);
  
  // Function to complete the drawing
  const completeDrawing = useCallback((point: Point) => {
    if (!canvas || !isDrawing || !currentLineRef.current) return;
    
    const line = currentLineRef.current;
    
    // Make the line selectable
    line.set({
      selectable: true,
      evented: true
    });
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    currentLineRef.current = null;
    
    // Save canvas state
    saveCurrentState();
    
    canvas.renderAll();
    
    toolsLogger.debug('Drawing completed', { point });
  }, [canvas, isDrawing, saveCurrentState]);
  
  // Function to cancel drawing
  const cancelDrawing = useCallback(() => {
    if (!canvas || !isDrawing) return;
    
    // Remove the current line
    if (currentLineRef.current) {
      canvas.remove(currentLineRef.current);
      canvas.renderAll();
    }
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    currentLineRef.current = null;
    
    toolsLogger.debug('Drawing cancelled');
  }, [canvas, isDrawing]);
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
    
    toast(snapEnabled ? "Grid snapping disabled" : "Grid snapping enabled");
  }, [snapEnabled]);
  
  // Toggle angle snapping
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
    
    toast(anglesEnabled ? "Angle snapping disabled" : "Angle snapping enabled");
  }, [anglesEnabled]);
  
  // Dummy implementation for renderTooltip
  const renderTooltip = useCallback(() => {
    return null;
  }, []);
  
  return {
    isActive,
    isEnabled: enabled,
    isDrawing,
    startPoint,
    currentPoint,
    currentLine: currentLineRef.current,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    isToolInitialized: true,
    inputMethod: 'mouse',
    isPencilMode: false,
    toggleSnap: toggleGridSnapping,
    startDrawing,
    continueDrawing,
    completeDrawing,
    endDrawing: completeDrawing,
    cancelDrawing,
    handlePointerDown: startDrawing,
    handlePointerMove: continueDrawing,
    handlePointerUp: completeDrawing,
    handleKeyDown: () => {},
    handleKeyUp: () => {},
    renderTooltip,
    setInputMethod: () => {},
    shiftKeyPressed: false,
    setCurrentLine: () => {},
    saveCurrentState
  };
};
