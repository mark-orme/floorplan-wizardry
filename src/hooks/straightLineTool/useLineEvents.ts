
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData, GRID_CONSTANTS } from '@/types/fabric-unified';
import { snapToGrid, snapToAngle } from '@/utils/geometry/pointOperations';
import logger from '@/utils/logger';

interface UseLineEventsProps {
  canvas: FabricCanvas | null;
  lineState: any; // LineState from useLineState hook
  snapEnabled: boolean;
  anglesEnabled: boolean;
  updateMeasurementData: (data: MeasurementData) => void;
}

export function useLineEvents({
  canvas,
  lineState,
  snapEnabled,
  anglesEnabled,
  updateMeasurementData
}: UseLineEventsProps) {
  // Get pointer coordinates from fabric mouse event
  const getPointerFromEvent = useCallback((e: any): Point => {
    if (!canvas) return { x: 0, y: 0 };
    
    return canvas.getPointer(e.e);
  }, [canvas]);
  
  // Apply snapping to point if enabled
  const applySnapping = useCallback((point: Point): Point => {
    if (!snapEnabled) return point;
    
    return snapToGrid(point);
  }, [snapEnabled]);
  
  // Apply angle constraints if enabled
  const applyAngleConstraints = useCallback((start: Point, end: Point): Point => {
    if (!anglesEnabled || !start) return end;
    
    return snapToAngle(start, end, 45);
  }, [anglesEnabled]);

  // Calculate midpoint between two points
  const calculateMidPoint = useCallback((p1: Point, p2: Point): Point => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }, []);
  
  // Handle mouse down event
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || !lineState) return;
    
    // Get pointer coordinates
    const pointer = getPointerFromEvent(e);
    
    // Apply snapping if enabled
    const snappedPoint = applySnapping(pointer);
    
    // Start drawing line
    lineState.startDrawing(snappedPoint);
    
    const midPoint = calculateMidPoint(snappedPoint, snappedPoint);
    
    // Initial measurement data
    updateMeasurementData({
      distance: 0,
      angle: 0,
      startPoint: snappedPoint,
      endPoint: snappedPoint,
      midPoint,
      snapped: pointer.x !== snappedPoint.x || pointer.y !== snappedPoint.y,
      unit: 'px',
      pixelsPerMeter: GRID_CONSTANTS.PIXELS_PER_METER
    });
    
    logger.debug('Mouse down', { original: pointer, snapped: snappedPoint });
  }, [canvas, lineState, getPointerFromEvent, applySnapping, calculateMidPoint, updateMeasurementData]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !lineState) return;
    
    // Get pointer coordinates
    const pointer = getPointerFromEvent(e);
    
    if (lineState.isDrawing && lineState.startPoint) {
      // Apply constraints if enabled
      let endPoint = applySnapping(pointer);
      endPoint = applyAngleConstraints(lineState.startPoint, endPoint);
      
      // Continue drawing the line
      lineState.continueDrawing(endPoint);
      
      // Calculate measurements
      const dx = endPoint.x - lineState.startPoint.x;
      const dy = endPoint.y - lineState.startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const midPoint = calculateMidPoint(lineState.startPoint, endPoint);
      
      // Update measurement data
      updateMeasurementData({
        distance,
        angle,
        startPoint: lineState.startPoint,
        endPoint: endPoint,
        midPoint,
        snapped: pointer.x !== endPoint.x || pointer.y !== endPoint.y,
        unit: 'px',
        pixelsPerMeter: GRID_CONSTANTS.PIXELS_PER_METER
      });
    }
  }, [canvas, lineState, getPointerFromEvent, applySnapping, applyAngleConstraints, calculateMidPoint, updateMeasurementData]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((e: any) => {
    if (!canvas || !lineState || !lineState.isDrawing) return;
    
    // Get pointer coordinates
    const pointer = getPointerFromEvent(e);
    
    // Apply constraints if enabled
    let endPoint = applySnapping(pointer);
    
    if (lineState.startPoint) {
      endPoint = applyAngleConstraints(lineState.startPoint, endPoint);
    }
    
    // Complete the drawing
    lineState.completeDrawing(endPoint);
    
    logger.debug('Mouse up', { original: pointer, final: endPoint });
  }, [canvas, lineState, getPointerFromEvent, applySnapping, applyAngleConstraints]);
  
  // Handle key down events (e.g., Escape to cancel)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && lineState) {
      lineState.cancelDrawing();
      logger.debug('Drawing cancelled via Escape key');
    }
  }, [lineState]);
  
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    cancelDrawing: lineState?.cancelDrawing
  };
}
