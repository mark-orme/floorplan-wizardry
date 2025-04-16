
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '@/types/measurement/MeasurementData';
import { snapToGrid } from '@/utils/geometry/pointOperations';
import logger from '@/utils/logger';

interface UseLineEventsProps {
  canvas: FabricCanvas | null;
  lineState: any; // LineState from useLineState hook
  snapEnabled: boolean;
  anglesEnabled: boolean;
  updateMeasurementData: (data: MeasurementData) => void;
}

export const useLineEvents = ({
  canvas,
  lineState,
  snapEnabled,
  anglesEnabled,
  updateMeasurementData
}: UseLineEventsProps) => {
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
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Determine if angle is close to 0, 45, 90, 135, 180 degrees
    const snapAngles = [0, 45, 90, 135, 180, -45, -90, -135];
    const closestAngle = snapAngles.reduce((prev, curr) => {
      return Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev;
    });
    
    // If angle is close to a snap angle (within 10 degrees), constrain it
    if (Math.abs(closestAngle - angle) < 10) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      const rads = closestAngle * Math.PI / 180;
      
      return {
        x: start.x + Math.cos(rads) * distance,
        y: start.y + Math.sin(rads) * distance
      };
    }
    
    return end;
  }, [anglesEnabled]);
  
  // Handle mouse down event
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || !lineState) return;
    
    // Get pointer coordinates
    const pointer = getPointerFromEvent(e);
    
    // Apply snapping if enabled
    const snappedPoint = applySnapping(pointer);
    
    // Start drawing line
    lineState.startDrawing(snappedPoint);
    
    // Initial measurement data
    updateMeasurementData({
      distance: 0,
      angle: 0,
      snapped: pointer.x !== snappedPoint.x || pointer.y !== snappedPoint.y,
      unit: 'px'
    });
    
    logger.debug('Mouse down', { original: pointer, snapped: snappedPoint });
  }, [canvas, lineState, getPointerFromEvent, applySnapping, updateMeasurementData]);
  
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
      
      // Update measurement data
      updateMeasurementData({
        distance,
        angle,
        snapped: pointer.x !== endPoint.x || pointer.y !== endPoint.y,
        unit: 'px'
      });
    }
  }, [canvas, lineState, getPointerFromEvent, applySnapping, applyAngleConstraints, updateMeasurementData]);
  
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
    cancelDrawing: lineState.cancelDrawing
  };
};
