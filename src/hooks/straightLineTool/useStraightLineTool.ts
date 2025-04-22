
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { useMeasurementCalculation } from './useMeasurementCalculation';
import { useLiveDistanceTooltip } from './useLiveDistanceTooltip';
import { UseStraightLineToolResult, MeasurementData } from '../useStraightLineTool.d';

interface UseStraightLineToolProps {
  canvas: Canvas | null;
  isEnabled?: boolean;
  lineColor?: string;
  lineThickness?: number;
  onDrawingComplete?: (line: Line) => void;
  onDrawingStart?: () => void;
  onDrawingCancel?: () => void;
}

export const useStraightLineTool = ({
  canvas,
  isEnabled = false,
  lineColor = '#000000',
  lineThickness = 2,
  onDrawingComplete,
  onDrawingStart,
  onDrawingCancel
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const pointsRef = useRef<Point[]>([]);
  
  // Get current input method for line drawing
  const { inputMethod, setInputMethod } = useLineInputMethod();
  const isPencilMode = inputMethod === 'pencil';
  
  // Initialize measurement data
  const initialMeasurementData: MeasurementData = {
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  };
  
  const [measurementData, setMeasurementData] = useState<MeasurementData>(initialMeasurementData);
  
  // Initialize the calculation hooks
  const { calculateMeasurements } = useMeasurementCalculation();
  const { renderTooltip } = useLiveDistanceTooltip({ measurementData });
  
  // Set active state when enabled
  useEffect(() => {
    setIsActive(isEnabled);
  }, [isEnabled]);
  
  // Initialize tool when canvas is ready
  useEffect(() => {
    if (canvas) {
      setIsToolInitialized(true);
    }
  }, [canvas]);
  
  // Toggle snapping
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Start drawing operation
  const startDrawing = useCallback((point: Point) => {
    if (!canvas || !isActive) return;
    
    setIsDrawing(true);
    pointsRef.current = [point];
    
    const line = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
    });
    
    canvas.add(line);
    setCurrentLine(line);
    
    if (onDrawingStart) {
      onDrawingStart();
    }
  }, [canvas, isActive, lineColor, lineThickness, onDrawingStart]);
  
  // Continue drawing operation
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !currentLine || !canvas) return;
    
    const startPoint = pointsRef.current[0];
    let endPoint = { ...point };
    
    // Apply angle constraints if shift key is pressed and angles are enabled
    if (shiftKeyPressed && anglesEnabled) {
      // Constrain to 0, 45, 90, 135, 180, 225, 270, or 315 degrees
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const snapAngle = Math.round(angle / 45) * 45;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      endPoint = {
        x: startPoint.x + distance * Math.cos(snapAngle * (Math.PI / 180)),
        y: startPoint.y + distance * Math.sin(snapAngle * (Math.PI / 180))
      };
      
      setMeasurementData(prev => ({ ...prev, snapped: true, snapType: 'angle' }));
    } else {
      setMeasurementData(prev => ({ ...prev, snapped: false }));
    }
    
    currentLine.set({
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    canvas.renderAll();
    
    // Update pointsRef
    pointsRef.current = [startPoint, endPoint];
    
    // Calculate and update measurements
    const measurements = calculateMeasurements(startPoint, endPoint);
    setMeasurementData(prev => ({ 
      ...prev, 
      distance: measurements.distance,
      angle: measurements.angle
    }));
  }, [isDrawing, currentLine, canvas, shiftKeyPressed, anglesEnabled, calculateMeasurements]);
  
  // Complete drawing operation
  const completeDrawing = useCallback((point: Point) => {
    if (!isDrawing || !currentLine || !canvas) return;
    
    const startPoint = pointsRef.current[0];
    
    currentLine.set({
      selectable: true,
      evented: true
    });
    
    setIsDrawing(false);
    canvas.setActiveObject(currentLine);
    canvas.renderAll();
    
    if (onDrawingComplete) {
      onDrawingComplete(currentLine);
    }
    
    // Reset measurement data
    setMeasurementData(initialMeasurementData);
  }, [isDrawing, currentLine, canvas, onDrawingComplete, initialMeasurementData]);
  
  // End drawing operation
  const endDrawing = useCallback(() => {
    if (!isDrawing || !currentLine) return;
    
    const lastPoint = pointsRef.current[pointsRef.current.length - 1];
    completeDrawing(lastPoint);
  }, [isDrawing, currentLine, completeDrawing]);
  
  // Cancel drawing operation
  const cancelDrawing = useCallback(() => {
    if (!isDrawing || !currentLine || !canvas) return;
    
    canvas.remove(currentLine);
    canvas.renderAll();
    
    setIsDrawing(false);
    setCurrentLine(null);
    pointsRef.current = [];
    
    // Reset measurement data
    setMeasurementData(initialMeasurementData);
    
    if (onDrawingCancel) {
      onDrawingCancel();
    }
  }, [isDrawing, currentLine, canvas, onDrawingCancel, initialMeasurementData]);
  
  // Pointer event handlers
  const handlePointerDown = useCallback((event: any) => {
    if (!isActive || !canvas) return;
    
    const pointer = canvas.getPointer(event.e);
    startDrawing({ x: pointer.x, y: pointer.y });
  }, [isActive, canvas, startDrawing]);
  
  const handlePointerMove = useCallback((event: any) => {
    if (!isActive || !isDrawing || !canvas) return;
    
    const pointer = canvas.getPointer(event.e);
    continueDrawing({ x: pointer.x, y: pointer.y });
  }, [isActive, isDrawing, canvas, continueDrawing]);
  
  const handlePointerUp = useCallback((event: any) => {
    if (!isActive || !isDrawing || !canvas) return;
    
    const pointer = canvas.getPointer(event.e);
    completeDrawing({ x: pointer.x, y: pointer.y });
  }, [isActive, isDrawing, canvas, completeDrawing]);
  
  // Keyboard event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setShiftKeyPressed(true);
    } else if (event.key === 'Escape') {
      cancelDrawing();
    }
  }, [cancelDrawing]);
  
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setShiftKeyPressed(false);
    }
  }, []);
  
  // Save current canvas state (for history)
  const saveCurrentState = useCallback(() => {
    // This function would typically integrate with history management
    console.log('Saving current state');
  }, []);
  
  // Return the hook result
  return {
    isActive,
    isEnabled,
    currentLine,
    isToolInitialized,
    isDrawing,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping: toggleSnap,
    toggleAngles,
    startDrawing,
    continueDrawing,
    endDrawing,
    completeDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    renderTooltip,
    setInputMethod,
    shiftKeyPressed,
    setCurrentLine,
    toggleSnap,
    saveCurrentState
  };
};
