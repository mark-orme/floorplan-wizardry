
import { useCallback, useState, useRef } from 'react';
import { Canvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '@/types/fabric-unified';
import useLineAngleSnap from './useLineAngleSnap';

interface UseStraightLineToolRefactoredOptions {
  canvas: Canvas | null;
  color?: string;
  thickness?: number;
  snapToGrid?: boolean;
  gridSize?: number;
  enabled?: boolean;
  onLineCreated?: (start: Point, end: Point, measurement: MeasurementData) => void;
}

export const useStraightLineToolRefactored = ({
  canvas,
  color = '#000000',
  thickness = 2,
  snapToGrid = false,
  gridSize = 20,
  enabled = false,
  onLineCreated,
}: UseStraightLineToolRefactoredOptions) => {
  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeLine, setActiveLine] = useState<any | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({});
  const startPointRef = useRef<Point | null>(null);
  
  // Angle snapping
  const { snapAngle, toggleEnabled: toggleAngleSnap, isEnabled: angleSnapEnabled } = useLineAngleSnap();
  
  // Calculate distance between two points
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    if (!p1 || !p2) return 0;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between two points
  const calculateAngle = useCallback((p1: Point, p2: Point): number => {
    if (!p1 || !p2) return 0;
    let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return Math.round(angle);
  }, []);
  
  // Handle mousedown
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || !enabled) return;
    
    const pointer = canvas.getPointer(e.e);
    const startPoint = { x: pointer.x, y: pointer.y };
    
    // Snap to grid if enabled
    if (snapToGrid && gridSize) {
      startPoint.x = Math.round(startPoint.x / gridSize) * gridSize;
      startPoint.y = Math.round(startPoint.y / gridSize) * gridSize;
    }
    
    startPointRef.current = startPoint;
    
    // Create measurement data
    const initialData: MeasurementData = {
      startPoint,
      endPoint: startPoint,
      distance: 0,
      angle: 0,
      unit: 'px',
    };
    
    setMeasurementData(initialData);
    setIsDrawing(true);
    
    // Create line
    const line = new fabric.Line(
      [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
      {
        stroke: color,
        strokeWidth: thickness,
        selectable: false,
        evented: false,
      }
    );
    
    canvas.add(line);
    canvas.renderAll();
    setActiveLine(line);
    
  }, [canvas, color, thickness, snapToGrid, gridSize, enabled]);
  
  // Handle mousemove
  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !isDrawing || !activeLine || !startPointRef.current) return;
    
    const pointer = canvas.getPointer(e.e);
    let endPoint = { x: pointer.x, y: pointer.y };
    
    // Apply angle snapping if enabled
    if (angleSnapEnabled) {
      const snapped = snapAngle(startPointRef.current, endPoint);
      endPoint = snapped.point;
    }
    
    // Snap to grid if enabled
    if (snapToGrid && gridSize > 0) {
      endPoint.x = Math.round(endPoint.x / gridSize) * gridSize;
      endPoint.y = Math.round(endPoint.y / gridSize) * gridSize;
    }
    
    // Calculate distance and angle
    const distance = calculateDistance(startPointRef.current, endPoint);
    const angle = calculateAngle(startPointRef.current, endPoint);
    
    // Update line
    activeLine.set({
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    // Calculate midpoint
    const midPoint = {
      x: (startPointRef.current.x + endPoint.x) / 2,
      y: (startPointRef.current.y + endPoint.y) / 2
    };
    
    // Update measurement data
    setMeasurementData({
      startPoint: startPointRef.current,
      endPoint,
      distance,
      angle,
      midPoint,
      unit: 'px',
      snapped: angleSnapEnabled,
    });
    
    canvas.renderAll();
    
  }, [canvas, isDrawing, activeLine, snapToGrid, gridSize, angleSnapEnabled, snapAngle, calculateDistance, calculateAngle]);
  
  // Handle mouseup
  const handleMouseUp = useCallback(() => {
    if (!canvas || !isDrawing || !activeLine || !startPointRef.current || !measurementData.endPoint) return;
    
    // Finalize line
    activeLine.set({
      selectable: true,
      evented: true,
    });
    
    // Notify about line creation
    if (onLineCreated && measurementData.startPoint && measurementData.endPoint) {
      onLineCreated(
        measurementData.startPoint,
        measurementData.endPoint,
        measurementData
      );
    }
    
    // Reset state
    setIsDrawing(false);
    setActiveLine(null);
    startPointRef.current = null;
    
    canvas.renderAll();
    
  }, [canvas, isDrawing, activeLine, onLineCreated, measurementData]);
  
  return {
    isDrawing,
    measurementData,
    activeLine,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleAngleSnap,
    angleSnapEnabled,
  };
};

export default useStraightLineToolRefactored;
