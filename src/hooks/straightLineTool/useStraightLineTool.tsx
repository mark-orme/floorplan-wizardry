
import { useEffect, useState, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { toast } from 'sonner';
import { Point } from '@/types/core/Point';
import { MeasurementData } from './types';
import { UseStraightLineToolProps } from './useStraightLineTool.d';

export function useStraightLineTool({
  isActive = false,
  canvas,
  shiftKeyPressed = false,
  lineColor = '#000000',
  lineThickness = 2,
  snapToGrid = false,
  saveCurrentState
}: UseStraightLineToolProps) {
  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isActive);
  const [snapEnabled, setSnapEnabled] = useState(snapToGrid);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: 0,
    angle: 0,
    snapped: false,
    unit: 'px',
  });

  // Refs
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<fabric.Text | null>(null);

  // Enable/disable tool based on isActive prop
  useEffect(() => {
    setIsEnabled(isActive);
  }, [isActive]);

  // Initialize fabric event listeners when tool is active
  useEffect(() => {
    if (!canvas) return;

    if (isEnabled && !isToolInitialized) {
      // Set up canvas for drawing
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
      
      // Set up event handlers
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);

      setIsToolInitialized(true);
    } else if (!isEnabled && isToolInitialized) {
      // Clean up event handlers
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);

      // Reset canvas state
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';

      setIsToolInitialized(false);
      resetDrawingState();
    }

    return () => {
      if (canvas) {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
      }
    };
  }, [isEnabled, canvas]);

  // Event handlers
  const handleMouseDown = (event: fabric.TEvent<MouseEvent>) => {
    if (!canvas || !event.pointer) return;
    
    if (event.e && 'button' in event.e && event.e.button !== 0) return; // Only handle left clicks
    
    const pointer = snapEnabled ? snapPointToGrid(event.pointer) : event.pointer;

    startPointRef.current = pointer;
    setIsDrawing(true);
    canvas.selection = false;

    // Create line
    const line = createLine(pointer.x, pointer.y, pointer.x, pointer.y);
    currentLineRef.current = line;
    canvas.add(line);

    // Create tooltip
    const tooltip = createDistanceTooltip(pointer.x, pointer.y, 0);
    distanceTooltipRef.current = tooltip;
    canvas.add(tooltip);
  };

  const handleMouseMove = (event: fabric.TEvent<MouseEvent>) => {
    if (!canvas || !isDrawing || !startPointRef.current || !event.pointer) return;

    let endPoint = event.pointer;
    
    // Apply constraints if shift key is pressed or angles are enabled
    if (shiftKeyPressed || anglesEnabled) {
      endPoint = constrainToAngle(startPointRef.current, endPoint);
    }
    
    // Snap to grid if enabled
    if (snapEnabled) {
      endPoint = snapPointToGrid(endPoint);
    }

    const startPoint = startPointRef.current;
    updateLineAndTooltip(startPoint, endPoint);
  };

  const handleMouseUp = (event: fabric.TEvent<MouseEvent>) => {
    if (!canvas || !isDrawing || !startPointRef.current || !currentLineRef.current) return;

    let endPoint = event.pointer as Point;
    
    // Apply constraints if shift key is pressed or angles are enabled
    if (shiftKeyPressed || anglesEnabled) {
      endPoint = constrainToAngle(startPointRef.current, endPoint);
    }
    
    // Snap to grid if enabled
    if (snapEnabled) {
      endPoint = snapPointToGrid(endPoint);
    }

    // Finalize the line
    const line = currentLineRef.current;
    line.selectable = true;
    line.evented = true;
    
    // Make the line permanent
    canvas.renderAll();
    
    // Reset drawing state
    resetDrawingState();
    
    // Save current state for undo/redo
    if (saveCurrentState) {
      saveCurrentState();
    }

    // Notify user
    const distance = calculateDistance(startPointRef.current, endPoint);
    toast.success(`Line created: ${distance.toFixed(2)}px`);
  };

  const resetDrawingState = () => {
    setIsDrawing(false);
    startPointRef.current = null;
    currentLineRef.current = null;
    
    if (distanceTooltipRef.current && canvas) {
      canvas.remove(distanceTooltipRef.current);
      distanceTooltipRef.current = null;
    }
  };

  const updateLineAndTooltip = (startPoint: Point, endPoint: Point) => {
    if (!canvas || !currentLineRef.current || !distanceTooltipRef.current) return;
    
    const line = currentLineRef.current;
    line.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    // Update tooltip
    const distance = calculateDistance(startPoint, endPoint);
    const angle = calculateAngle(startPoint, endPoint);
    
    const midPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };
    
    distanceTooltipRef.current.set({
      left: midPoint.x,
      top: midPoint.y,
      text: `${distance.toFixed(2)} px\n${angle.toFixed(1)}°`
    });
    
    // Update measurement data
    setMeasurementData({
      distance,
      angle,
      snapped: snapEnabled,
      unit: 'px',
      startPoint,
      endPoint,
      snapType: snapEnabled ? 'grid' : undefined
    });
    
    canvas.renderAll();
  };

  // Helper functions
  const createLine = (x1: number, y1: number, x2: number, y2: number): Line => {
    return new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      objectCaching: false
    });
  };

  const createDistanceTooltip = (x: number, y: number, distance: number): fabric.Text => {
    return new fabric.Text(`${distance.toFixed(2)} px`, {
      left: x,
      top: y,
      fontSize: 12,
      fill: '#000',
      backgroundColor: 'rgba(255,255,255,0.8)',
      padding: 5,
      selectable: false,
      evented: false
    });
  };

  const calculateDistance = (point1: Point, point2: Point): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateAngle = (point1: Point, point2: Point): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const constrainToAngle = (startPoint: Point, endPoint: Point): Point => {
    const angle = calculateAngle(startPoint, endPoint);
    const distance = calculateDistance(startPoint, endPoint);
    
    // Round angle to nearest 45 degrees
    const snappedAngle = Math.round(angle / 45) * 45;
    
    // Convert back to radians
    const radians = (snappedAngle * Math.PI) / 180;
    
    // Calculate new point
    return {
      x: startPoint.x + distance * Math.cos(radians),
      y: startPoint.y + distance * Math.sin(radians)
    };
  };

  const snapPointToGrid = (point: Point): Point => {
    const gridSize = 20; // Grid size in pixels
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  const toggleSnap = () => {
    setSnapEnabled(!snapEnabled);
  };

  const toggleAngles = () => {
    setAnglesEnabled(!anglesEnabled);
  };

  return {
    isDrawing,
    isEnabled,
    isToolInitialized,
    snapEnabled,
    anglesEnabled,
    measurementData,
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    toggleSnap,
    toggleAngles,
    resetDrawingState
  };
}
