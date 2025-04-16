
import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLineAngleSnap } from './useLineAngleSnap';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';
import { useMeasurementCalculation } from './useMeasurementCalculation';
import { useLineDrawing } from './useLineDrawing';

interface UseLineToolHandlersProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useLineToolHandlers = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseLineToolHandlersProps) => {
  // State for drawing
  const [isActive, setIsActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  // Refs for canvas and tools
  const fabricCanvasRef = useRef<FabricCanvas | null>(canvas);
  
  // Use input method hook
  const { inputMethod, isPencilMode, setInputMethod, setIsPencilMode } = useLineInputMethod();
  
  // Use grid snapping hook
  const { snapEnabled, toggleGridSnapping: toggleSnap, snapToGrid } = useEnhancedGridSnapping();
  
  // Use angle snapping hook
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const { snapToAngle } = useLineAngleSnap({ enabled: true });
  
  // Use measurement calculation
  const { calculateMeasurement } = useMeasurementCalculation();
  
  // Use line drawing hook
  const { createLine, updateLine, finalizeLine, removeLine } = useLineDrawing(
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  );
  
  // Measurement data
  const [measurementData, setMeasurementData] = useState({
    distance: null as number | null,
    angle: 0,
    unit: 'm',
    snapped: false,
    snapType: undefined as 'grid' | 'angle' | 'both' | undefined
  });
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Update measurement data
  const updateMeasurementData = useCallback((
    start: Point,
    current: Point,
    snapEnabled: boolean,
    anglesEnabled: boolean
  ) => {
    if (!start || !current) return;
    
    let distance = calculateDistance(start, current);
    let angle = calculateAngle(start, current);
    let isSnapped = false;
    let snapType: 'grid' | 'angle' | 'both' | undefined = undefined;
    
    // Apply snapping if enabled
    if (snapEnabled || anglesEnabled) {
      // Initialize snap point with the current point
      let snappedPoint = { ...current };
      
      // Apply grid snapping if enabled
      if (snapEnabled) {
        snappedPoint = snapToGrid(snappedPoint);
        isSnapped = true;
        snapType = 'grid';
      }
      
      // Apply angle snapping if enabled
      if (anglesEnabled) {
        snappedPoint = snapToAngle(start, snappedPoint);
        
        // Update snap type
        if (isSnapped) {
          snapType = 'both';
        } else {
          isSnapped = true;
          snapType = 'angle';
        }
      }
      
      // Recalculate measurements with the snapped point
      if (isSnapped) {
        distance = calculateDistance(start, snappedPoint);
        angle = calculateAngle(start, snappedPoint);
      }
    }
    
    setMeasurementData({
      distance,
      angle,
      unit: 'm',
      snapped: isSnapped,
      snapType
    });
  }, [snapToGrid, snapToAngle]);
  
  // Start drawing
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled || !canvas) return;
    
    // Set active state
    setIsActive(true);
    
    // Get canvas position
    const rect = canvas.getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Apply snapping if enabled
    let point = { x, y };
    if (snapEnabled) {
      point = snapToGrid(point);
    }
    
    // Set start point
    setStartPoint(point);
    setCurrentPoint(point);
    setIsDrawing(true);
    
    // Create initial line
    const line = createLine(point.x, point.y, point.x, point.y);
    if (line) {
      setCurrentLine(line);
    }
    
    // Set input method based on pointer type
    if (e instanceof PointerEvent) {
      setInputMethod(e.pointerType === 'pen' ? InputMethod.PENCIL : InputMethod.MOUSE);
    }
  }, [canvas, enabled, snapEnabled, snapToGrid, createLine, setInputMethod]);
  
  // Continue drawing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDrawing || !startPoint || !canvas || !currentLine) return;
    
    // Get canvas position
    const rect = canvas.getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Apply snapping if enabled
    let point = { x, y };
    
    // Update current point
    setCurrentPoint(point);
    
    // Update line position
    const data = updateLine(
      currentLine,
      startPoint.x,
      startPoint.y,
      point.x,
      point.y
    );
    
    // Update measurement data
    if (data) {
      setMeasurementData({
        distance: data.distance,
        angle: data.angle,
        unit: 'm',
        snapped: data.isSnapped,
        snapType: data.snapType
      });
    } else {
      updateMeasurementData(startPoint, point, snapEnabled, anglesEnabled);
    }
    
    // Check for shift key
    setShiftKeyPressed(e.shiftKey);
    
    // Force rendering
    canvas.requestRenderAll();
  }, [isDrawing, startPoint, canvas, currentLine, updateLine, updateMeasurementData, snapEnabled, anglesEnabled]);
  
  // End drawing
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDrawing || !startPoint || !currentPoint || !canvas || !currentLine) return;
    
    // Get canvas position
    const rect = canvas.getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Apply snapping if enabled
    let endPoint = { x, y };
    if (snapEnabled) {
      endPoint = snapToGrid(endPoint);
    }
    
    // Apply angle snapping if enabled
    if (anglesEnabled) {
      endPoint = snapToAngle(startPoint, endPoint);
    }
    
    // Finalize the line
    finalizeLine(
      currentLine,
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y
    );
    
    // Reset drawing state
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    
    // Save current state for undo/redo
    saveCurrentState();
  }, [isDrawing, startPoint, currentPoint, canvas, currentLine, snapEnabled, anglesEnabled, snapToGrid, snapToAngle, finalizeLine, saveCurrentState]);
  
  return {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    shiftKeyPressed,
    measurementData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleGridSnapping: toggleSnap,
    toggleAngles,
    updateMeasurementData
  };
};
