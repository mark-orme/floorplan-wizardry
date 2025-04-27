
/**
 * Hook for creating and managing straight line drawing tool
 * @module hooks/straightLineTool/useStraightLineTool
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { MeasurementData } from './types';
import { FabricCanvasMouseEvent } from '@/types/fabricEvents';

interface StraightLineMeasurement {
  distance: number;
  angle: number;
  snapped: boolean;
}

interface UseStraightLineToolProps {
  canvas?: FabricCanvas | null;
  isActive?: boolean;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  snapThreshold?: number;
  saveCurrentState?: () => void;
}

/**
 * Hook for straight line drawing tool
 * @param {UseStraightLineToolProps} props - Tool configuration
 */
export const useStraightLineTool = ({
  canvas = null,
  isActive = false,
  lineColor = '#000000',
  lineThickness = 2,
  snapToGrid = false,
  snapThreshold = 10,
  saveCurrentState
}: UseStraightLineToolProps) => {
  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(snapToGrid);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [measurement, setMeasurement] = useState<StraightLineMeasurement>({
    distance: 0,
    angle: 0,
    snapped: false
  });

  // Get input method from hook
  const { inputMethod } = useLineInputMethod();
  
  // Handle tool activation/deactivation
  useEffect(() => {
    if (!isActive && isDrawing) {
      cancelDrawing();
    }
  }, [isActive]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentLine && canvas) {
        canvas.remove(currentLine);
      }
    };
  }, []);

  /**
   * Calculate distance and angle between two points
   */
  const calculateMeasurement = useCallback((start: Point, end: Point): StraightLineMeasurement => {
    if (!start || !end) {
      return { distance: 0, angle: 0, snapped: false };
    }
    
    // Calculate distance using Pythagorean theorem
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle (in degrees)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle < 0 ? angle + 360 : angle);
    
    // Snap angle to nearest 45 degrees if angles enabled
    let snapped = false;
    if (anglesEnabled || shiftPressed) {
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      const closestAngle = snapAngles.reduce((prev, curr) => {
        return (Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev);
      });
      
      if (Math.abs(closestAngle - angle) < 10) {  // 10 degree threshold for snapping
        angle = closestAngle;
        snapped = true;
      }
    }
    
    return { distance, angle, snapped };
  }, [anglesEnabled, shiftPressed]);

  /**
   * Start drawing a line
   */
  const startDrawing = useCallback((point: Point) => {
    if (!canvas || !isActive) return;
    
    console.log('Starting line drawing at', point);
    
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentPoint(point);
    
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    canvas.add(line);
    setCurrentLine(line);
    
    // Reset measurement
    setMeasurement({ distance: 0, angle: 0, snapped: false });
  }, [canvas, isActive, lineColor, lineThickness]);
  
  /**
   * Continue drawing - update the line as the pointer moves
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!canvas || !isActive || !isDrawing || !currentLine || !startPoint) return;
    
    let endPoint = { ...point };
    
    // Apply angle constraints if needed
    if (anglesEnabled || shiftPressed) {
      const dx = point.x - startPoint.x;
      const dy = point.y - startPoint.y;
      let angle = Math.atan2(dy, dx);
      
      // Snap to nearest 45 degree increment
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      endPoint = {
        x: startPoint.x + distance * Math.cos(snapAngle),
        y: startPoint.y + distance * Math.sin(snapAngle)
      };
    }
    
    // Update line coordinates
    currentLine.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    // Update current point and measurement
    setCurrentPoint(endPoint);
    const newMeasurement = calculateMeasurement(startPoint, endPoint);
    setMeasurement(newMeasurement);
    
    canvas.renderAll();
  }, [canvas, isActive, isDrawing, currentLine, startPoint, anglesEnabled, shiftPressed, calculateMeasurement]);

  /**
   * Complete drawing - finalize the line
   */
  const completeDrawing = useCallback((point: Point) => {
    if (!canvas || !isActive || !isDrawing || !startPoint) return;
    
    console.log('Completing line drawing at', point);
    
    // Get end point from current state
    const endPoint = currentPoint || point;
    
    // Minimum line length check to prevent accidental clicks
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      // Line too short, cancel it
      cancelDrawing();
      return;
    }
    
    // Finalize the line
    if (currentLine) {
      currentLine.set({
        selectable: true,
        evented: true
      });
      
      canvas.renderAll();
      
      // Save state if callback provided
      if (saveCurrentState) {
        saveCurrentState();
      }
    }
    
    // Reset state
    setIsDrawing(false);
    setCurrentLine(null);
  }, [canvas, isActive, isDrawing, startPoint, currentPoint, saveCurrentState]);

  /**
   * Cancel drawing - remove the current line
   */
  const cancelDrawing = useCallback(() => {
    if (canvas && currentLine) {
      canvas.remove(currentLine);
      canvas.renderAll();
    }
    
    // Reset state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setMeasurement({ distance: 0, angle: 0, snapped: false });
  }, [canvas, currentLine]);

  /**
   * Toggle snap to grid
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  /**
   * Handle key down events
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftPressed(true);
    } else if (e.key === 'Escape' && isDrawing) {
      cancelDrawing();
    }
  }, [isDrawing, cancelDrawing]);

  /**
   * Handle key up events
   */
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftPressed(false);
    }
  }, []);

  /**
   * End drawing - alias for complete drawing
   */
  const endDrawing = useCallback(() => {
    if (currentPoint) {
      completeDrawing(currentPoint);
    }
  }, [currentPoint, completeDrawing]);

  /**
   * Render measurement tooltip
   */
  const renderTooltip = useCallback(() => {
    if (!isDrawing || !measurement) return null;
    
    const distanceText = `${Math.round(measurement.distance)}px`;
    const angleText = `${Math.round(measurement.angle)}°`;
    
    return (
      <div className="absolute bg-white border border-gray-200 rounded px-2 py-1 text-sm shadow-md z-50">
        <div>Distance: {distanceText}</div>
        <div>Angle: {angleText}</div>
      </div>
    );
  }, [isDrawing, measurement]);

  // Set up event listeners for canvas
  useEffect(() => {
    if (!canvas || !isActive) return;
    
    const handleMouseDown = (event: FabricCanvasMouseEvent) => {
      if (!event.e) return;
      const pointer = canvas.getPointer(event.e);
      startDrawing({ x: pointer.x, y: pointer.y });
    };
    
    const handleMouseMove = (event: FabricCanvasMouseEvent) => {
      if (!isDrawing || !event.e) return;
      const pointer = canvas.getPointer(event.e);
      continueDrawing({ x: pointer.x, y: pointer.y });
    };
    
    const handleMouseUp = () => {
      if (isDrawing) {
        endDrawing();
      }
    };
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Remove event listeners on cleanup
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas, isActive, isDrawing, startDrawing, continueDrawing, endDrawing, handleKeyDown, handleKeyUp]);

  // Return the hook API
  return {
    isDrawing,
    currentLine,
    startPoint,
    currentPoint,
    measurement,
    snapEnabled,
    anglesEnabled,
    inputMethod,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    toggleSnap,
    toggleAngles,
    handleKeyDown,
    handleKeyUp,
    renderTooltip
  };
};
