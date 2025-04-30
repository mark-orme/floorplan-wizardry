
import { useCallback, useState } from 'react';
import { Point, MeasurementData } from '@/types/fabric-unified';
import { DrawingMode, GRID_CONSTANTS } from '@/constants/drawingModes';

// Export measurement data interface for reuse
export { MeasurementData } from '@/types/fabric-unified';

interface UseStraightLineToolProps {
  initialTool?: DrawingMode;
  initialSnapEnabled?: boolean;
  initialAngleSnapEnabled?: boolean;
  gridSize?: number;
  onLineCreated?: (startPoint: Point, endPoint: Point) => void;
}

export const useStraightLineTool = ({
  initialTool = DrawingMode.LINE,
  initialSnapEnabled = true,
  initialAngleSnapEnabled = false,
  gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE,
  onLineCreated
}: UseStraightLineToolProps = {}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [snapToGridEnabled, setSnapToGridEnabled] = useState(initialSnapEnabled);
  const [angleSnapEnabled, setAngleSnapEnabled] = useState(initialAngleSnapEnabled);
  
  // Calculate measurement data
  const getMeasurementData = useCallback((): MeasurementData | null => {
    if (!startPoint || !endPoint) return null;
    
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    const midPoint = {
      x: startPoint.x + dx / 2,
      y: startPoint.y + dy / 2
    };
    
    return {
      distance,
      startPoint,
      endPoint,
      midPoint,
      angle,
      unit: 'px',
      pixelsPerMeter: GRID_CONSTANTS.PIXELS_PER_METER
    };
  }, [startPoint, endPoint]);
  
  // Snap point to grid
  const snapToGrid = useCallback((point: Point): Point => {
    if (!snapToGridEnabled) return point;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapToGridEnabled, gridSize]);
  
  // Snap to common angles (0, 45, 90, etc.)
  const snapToAngle = useCallback((start: Point, current: Point): Point => {
    if (!angleSnapEnabled || !start) return current;
    
    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Angle in radians
    let angle = Math.atan2(dy, dx);
    
    // Snap to 45-degree increments
    const snapAngle = Math.PI / 4; // 45 degrees
    angle = Math.round(angle / snapAngle) * snapAngle;
    
    return {
      x: start.x + Math.cos(angle) * distance,
      y: start.y + Math.sin(angle) * distance
    };
  }, [angleSnapEnabled]);
  
  const startDrawing = useCallback((point: Point) => {
    const snappedPoint = snapToGrid(point);
    setStartPoint(snappedPoint);
    setEndPoint(snappedPoint);
    setIsDrawing(true);
  }, [snapToGrid]);
  
  const updateDrawing = useCallback((point: Point) => {
    if (!isDrawing || !startPoint) return;
    
    // First snap to grid, then snap to angle if enabled
    let processedPoint = snapToGrid(point);
    processedPoint = snapToAngle(startPoint, processedPoint);
    
    setEndPoint(processedPoint);
  }, [isDrawing, startPoint, snapToGrid, snapToAngle]);
  
  const finishDrawing = useCallback(() => {
    if (!isDrawing || !startPoint || !endPoint) return;
    
    // Notify parent component
    if (onLineCreated) {
      onLineCreated(startPoint, endPoint);
    }
    
    setIsDrawing(false);
  }, [isDrawing, startPoint, endPoint, onLineCreated]);
  
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setEndPoint(null);
  }, []);
  
  return {
    isDrawing,
    startPoint,
    endPoint,
    snapToGridEnabled,
    angleSnapEnabled,
    setSnapToGridEnabled,
    setAngleSnapEnabled,
    startDrawing,
    updateDrawing,
    finishDrawing,
    cancelDrawing,
    getMeasurementData,
    toggleGridSnap: () => setSnapToGridEnabled(prev => !prev),
    toggleAngleSnap: () => setAngleSnapEnabled(prev => !prev)
  };
};
