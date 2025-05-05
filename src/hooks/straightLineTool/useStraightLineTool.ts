
import { useCallback, useState, useRef, useEffect } from 'react';
import { Point, pointsEqual } from '@/types/core/Point';
import { MeasurementData } from '@/types/fabric-unified';
import { Canvas } from 'fabric';
import logger from '@/utils/logger';
import useMeasurementCalculation from './useMeasurementCalculation';
import { useLineState } from './useLineState';
import { UseStraightLineToolOptions, UseStraightLineToolResult } from './useStraightLineTool.d';

/**
 * Hook to manage straight line drawing tool functionality
 */
export function useStraightLineTool({
  isEnabled = false, 
  canvas = null,
  lineColor = '#000000', 
  lineThickness = 2,
  snapToGrid = false,
  snapToAngle = false,
  saveCurrentState = () => {}
}: {
  isEnabled?: boolean;
  canvas: Canvas | null;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  snapToAngle?: boolean;
  saveCurrentState?: () => void;
}): UseStraightLineToolResult {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(snapToGrid);
  const [snapAngleEnabled, setSnapAngleEnabled] = useState(snapToAngle);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  
  const { calculateDistance, calculateAngle, calculateMidPoint, createMeasurement } = useMeasurementCalculation();
  
  const fabricCanvasRef = useRef(canvas);
  
  // Update canvas ref when it changes
  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);
  
  // Start drawing from the given point
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    
    logger.debug('Started drawing line', { startPoint: point });
  }, []);
  
  // Continue drawing to the current point
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    setCurrentPoint(point);
    
    // Calculate measurement data
    if (startPoint && point) {
      const measurement = createMeasurement(startPoint, point);
      setMeasurementData(measurement);
    }
    
    logger.debug('Continuing line drawing', { currentPoint: point });
  }, [isDrawing, startPoint, createMeasurement]);
  
  // Complete the drawing operation
  const completeDrawing = useCallback((point?: Point) => {
    if (!isDrawing || !startPoint) return;
    
    const endPoint = point || currentPoint;
    
    if (endPoint && !pointsEqual(startPoint, endPoint)) {
      logger.debug('Completing line drawing', { startPoint, endPoint });
    } else {
      logger.debug('Cancelling line drawing - start and end points are the same');
    }
    
    setIsDrawing(false);
    saveCurrentState();
  }, [isDrawing, startPoint, currentPoint, saveCurrentState]);
  
  // Cancel the current drawing operation
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setMeasurementData(null);
    
    logger.debug('Drawing cancelled');
  }, []);
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angle snapping
  const toggleAngleSnapping = useCallback(() => {
    setSnapAngleEnabled(prev => !prev);
  }, []);
  
  // Implement renderTooltip for interface compatibility
  const renderTooltip = useCallback(() => null, []);
  
  // Add handlers for mouse events
  const handleMouseDown = useCallback((point: Point) => {
    startDrawing(point);
  }, [startDrawing]);
  
  const handleMouseMove = useCallback((point: Point) => {
    if (isDrawing) {
      continueDrawing(point);
    }
  }, [isDrawing, continueDrawing]);
  
  const handleMouseUp = useCallback((point?: Point) => {
    completeDrawing(point);
  }, [completeDrawing]);
  
  return {
    isDrawing,
    startPoint,
    currentPoint,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    snapEnabled,
    snapAngleEnabled,
    toggleGridSnapping,
    toggleAngleSnapping,
    setSnapEnabled,
    setSnapAngleEnabled,
    measurementData,
    // Add missing properties for interface compatibility
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isActive: isEnabled,
    renderTooltip,
    anglesEnabled: snapAngleEnabled,
    toggleAngles: toggleAngleSnapping
  };
}
