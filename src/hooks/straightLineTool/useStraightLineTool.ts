
import { useCallback, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';

export interface MeasurementData {
  distance: number;
  startPoint: Point;
  endPoint: Point;
  midPoint: Point;
  angle: number;
  unit: 'px' | 'm' | 'cm' | 'mm';
  snapped?: boolean;
  pixelsPerMeter: number;
}

export interface UseStraightLineToolProps {
  canvas?: FabricCanvas | null;
  lineColor?: string;
  lineThickness?: number;
  saveCurrentState?: () => void;
  isEnabled?: boolean;
  isActive?: boolean;
}

export function useStraightLineTool(props: UseStraightLineToolProps) {
  const {
    canvas,
    lineColor = '#000000',
    lineThickness = 2,
    saveCurrentState = () => {},
    isEnabled = true,
    isActive = true
  } = props;

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [snapToGridEnabled, setSnapToGridEnabled] = useState(true);
  const [angleSnapEnabled, setAngleSnapEnabled] = useState(true);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);

  // Toggle functions for grid and angle snapping
  const toggleGridSnap = useCallback(() => {
    setSnapToGridEnabled(prev => !prev);
  }, []);

  const toggleAngleSnap = useCallback(() => {
    setAngleSnapEnabled(prev => !prev);
  }, []);

  // Alias for backwards compatibility
  const toggleGridSnapping = toggleGridSnap;
  const toggleAngles = toggleAngleSnap;
  const snapEnabled = snapToGridEnabled;
  const anglesEnabled = angleSnapEnabled;

  // Mouse event handlers
  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || !isActive) return;
    const pointer = canvas.getPointer(e.e);
    setIsDrawing(true);
    setStartPoint({ x: pointer.x, y: pointer.y });
    setEndPoint({ x: pointer.x, y: pointer.y });
    
    // Create a new line
    const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    setCurrentLine(line);
  }, [canvas, isActive, lineColor, lineThickness]);

  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !isDrawing || !currentLine) return;
    const pointer = canvas.getPointer(e.e);
    
    // Update end point
    let newEndPoint = { x: pointer.x, y: pointer.y };
    
    // Apply snapping if enabled
    if (snapToGridEnabled) {
      newEndPoint = snapPointToGrid(newEndPoint);
    }
    
    if (angleSnapEnabled) {
      newEndPoint = snapToAngle(startPoint, newEndPoint);
    }
    
    setEndPoint(newEndPoint);
    
    // Update line
    currentLine.set({
      x2: newEndPoint.x - startPoint.x,
      y2: newEndPoint.y - startPoint.y
    });
    
    // Calculate measurement data
    updateMeasurementData(startPoint, newEndPoint);
    
    canvas.renderAll();
  }, [canvas, isDrawing, currentLine, startPoint, snapToGridEnabled, angleSnapEnabled]);

  const handleMouseUp = useCallback(() => {
    if (!canvas || !isDrawing) return;
    setIsDrawing(false);
    
    // Finalize the drawing
    if (currentLine) {
      currentLine.setCoords();
      canvas.setActiveObject(currentLine);
      canvas.renderAll();
      saveCurrentState();
    }
    
    setCurrentLine(null);
  }, [canvas, isDrawing, currentLine, saveCurrentState]);

  // Helper functions
  const snapPointToGrid = useCallback((point: Point): Point => {
    const gridSize = 20;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, []);

  const snapToAngle = useCallback((startPoint: Point, endPoint: Point): Point => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.atan2(dy, dx);
    
    // Snap to 45-degree increments
    const snapAngle = Math.PI / 4; // 45 degrees in radians
    const snappedAngle = Math.round(angle / snapAngle) * snapAngle;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return {
      x: startPoint.x + distance * Math.cos(snappedAngle),
      y: startPoint.y + distance * Math.sin(snappedAngle)
    };
  }, []);

  const updateMeasurementData = useCallback((startPoint: Point, endPoint: Point) => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    setMeasurementData({
      distance,
      startPoint,
      endPoint,
      midPoint: {
        x: startPoint.x + dx / 2,
        y: startPoint.y + dy / 2
      },
      angle,
      unit: 'px',
      pixelsPerMeter: 100,
      snapped: snapToGridEnabled || angleSnapEnabled
    });
  }, [snapToGridEnabled, angleSnapEnabled]);

  // Cleanup function
  useEffect(() => {
    if (!canvas) return;
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    return () => {
      // Remove event listeners
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Render tooltip function
  const renderTooltip = useCallback(() => {
    if (!measurementData) return null;
    
    return (
      <div
        style={{
          position: 'absolute',
          left: measurementData.midPoint.x,
          top: measurementData.midPoint.y,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none'
        }}
      >
        {Math.round(measurementData.distance)} px
        <br />
        {Math.round(measurementData.angle)}°
      </div>
    );
  }, [measurementData]);

  return {
    isDrawing,
    startPoint,
    endPoint,
    snapToGridEnabled,
    angleSnapEnabled,
    setSnapToGridEnabled,
    setAngleSnapEnabled,
    toggleGridSnap,
    toggleAngleSnap,
    
    // For backwards compatibility
    toggleGridSnapping,
    toggleAngles,
    snapEnabled,
    anglesEnabled,
    measurementData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    renderTooltip,
    isActive
  };
}

export default useStraightLineTool;
