
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { registerLineCreation } from './lineEvents';
import { MeasurementData } from '@/types/fabric-unified';

interface UseLineEventsProps {
  canvas: FabricCanvas | null;
  isEnabled: boolean;
  lineColor: string;
  lineThickness: number;
  snapEnabled?: boolean;
  snapPoints?: Point[];
  anglesEnabled?: boolean;
  onLineCreated?: (line: Line, start: Point, end: Point) => void;
}

export const useLineEvents = ({
  canvas,
  isEnabled,
  lineColor,
  lineThickness,
  snapEnabled = false,
  snapPoints = [],
  anglesEnabled = false,
  onLineCreated
}: UseLineEventsProps) => {
  const lineRef = useRef<Line | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef<Point | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  
  // Constants for calculations
  const PIXELS_PER_METER = 100; // 100 pixels = 1 meter
  
  // Calculate distance between two points
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between two points
  const calculateAngle = useCallback((p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  }, []);
  
  // Update measurement data
  const updateMeasurementData = useCallback((start: Point, end: Point, snapped: boolean = false) => {
    if (!start || !end) {
      setMeasurementData(null);
      return;
    }
    
    const distance = calculateDistance(start, end);
    const distanceInMeters = distance / PIXELS_PER_METER;
    
    const angle = calculateAngle(start, end);
    const midPoint = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };
    
    setMeasurementData({
      distance,
      angle,
      units: 'px',
      startPoint: start,
      endPoint: end,
      midPoint,
      snapped,
      pixelsPerMeter: PIXELS_PER_METER
    });
    
    setLastPoint(end);
  }, [calculateDistance, calculateAngle]);
  
  // Snap to grid or angles
  const snapToGridOrAngles = useCallback((start: Point, current: Point): { point: Point, snapped: boolean } => {
    if (!snapEnabled && !anglesEnabled) return { point: current, snapped: false };
    
    let result = { ...current };
    let snapped = false;
    
    if (snapEnabled && snapPoints.length > 0) {
      // Find the closest snap point
      let minDistance = Number.MAX_VALUE;
      let closestPoint: Point | null = null;
      
      for (const point of snapPoints) {
        const distance = calculateDistance(current, point);
        if (distance < minDistance && distance < 10) { // 10px snap radius
          minDistance = distance;
          closestPoint = point;
        }
      }
      
      if (closestPoint) {
        result = closestPoint;
        snapped = true;
      }
    }
    
    if (anglesEnabled && start) {
      // Snap to 15 degree increments
      const angle = calculateAngle(start, result);
      const snappedAngle = Math.round(angle / 15) * 15;
      
      const distance = calculateDistance(start, result);
      const angleRadians = snappedAngle * (Math.PI / 180);
      
      const snappedPoint = {
        x: start.x + distance * Math.cos(angleRadians),
        y: start.y + distance * Math.sin(angleRadians)
      };
      
      // Check if we're close enough to the snapped angle
      const originalToSnappedAngleDistance = calculateDistance(result, snappedPoint);
      if (originalToSnappedAngleDistance < 10) { // 10px angle snap radius
        result = snappedPoint;
        snapped = true;
      }
    }
    
    return { point: result, snapped };
  }, [snapEnabled, snapPoints, anglesEnabled, calculateDistance, calculateAngle]);
  
  // Handle mouse down
  const handleMouseDown = useCallback((e: any) => {
    if (!isEnabled || !canvas || isDrawing) return;
    
    const pointer = canvas.getPointer(e.e);
    startPointRef.current = pointer;
    
    // Create a new line
    const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    lineRef.current = line;
    setIsDrawing(true);
    
    // Update measurement data
    updateMeasurementData(pointer, pointer);
  }, [isEnabled, canvas, isDrawing, lineColor, lineThickness, updateMeasurementData]);
  
  // Handle mouse move
  const handleMouseMove = useCallback((e: any) => {
    if (!isEnabled || !canvas || !isDrawing || !lineRef.current || !startPointRef.current) return;
    
    const pointer = canvas.getPointer(e.e);
    const { point: snappedPoint, snapped } = snapToGridOrAngles(startPointRef.current, pointer);
    
    // Update line end point
    lineRef.current.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    canvas.renderAll();
    
    // Update measurement data
    updateMeasurementData(startPointRef.current, snappedPoint, snapped);
  }, [isEnabled, canvas, isDrawing, snapToGridOrAngles, updateMeasurementData]);
  
  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isEnabled || !canvas || !isDrawing || !lineRef.current || !startPointRef.current) return;
    
    const line = lineRef.current;
    const start = startPointRef.current;
    const end = { x: line.x2!, y: line.y2! };
    
    // Check if the line has any length
    const distance = calculateDistance(start, end);
    if (distance < 2) {
      // Too short, remove the line
      canvas.remove(line);
    } else {
      // Make the line interactive
      line.set({
        selectable: true,
        evented: true
      });
      
      // Register line creation event
      registerLineCreation(canvas, line, start, end);
      
      // Notify creation
      if (onLineCreated) {
        onLineCreated(line, start, end);
      }
    }
    
    // Reset state
    lineRef.current = null;
    startPointRef.current = null;
    setIsDrawing(false);
  }, [isEnabled, canvas, isDrawing, calculateDistance, onLineCreated]);
  
  // Set up event handlers
  useEffect(() => {
    if (!canvas || !isEnabled) return;
    
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, isEnabled, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  return {
    isDrawing,
    measurementData,
    lastPoint
  };
};

export default useLineEvents;
