import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { UseStraightLineToolProps, MeasurementData } from './useStraightLineTool.d';
import { useLineDrawingState } from './useLineDrawingState';
import { useLineDrawing } from './useLineDrawing';
import { useLiveDistanceTooltip } from './useLiveDistanceTooltip';
import { useLineToolResult } from './useLineToolResult';
import { useToolInitialization } from './useToolInitialization';
import { useLineToolHandlers } from './useLineToolHandlers';
import { InputMethod } from './useLineInputMethod';
import { toolsLogger } from '@/utils/logger';
import { Point } from '@/types/core/Point';
import { useSnapToGrid } from '../useSnapToGrid';
import { useMeasurementCalculation } from './useMeasurementCalculation';

/**
 * Hook for the straight line tool
 */
export const useStraightLineTool = (props: UseStraightLineToolProps) => {
  const {
    isActive = false,
    isEnabled = true,
    canvas: initialCanvas,
    shiftKeyPressed: initialShiftKeyPressed = false,
    lineColor = '#000000',
    lineThickness = 2,
    snapToGrid: initialSnapToGrid = false,
    saveCurrentState,
    anglesEnabled: initialAnglesEnabled = false
  } = props;
  
  // Refs
  const fabricCanvasRef = useRef<FabricCanvas | null>(initialCanvas || null);
  const linePreviewRef = useRef<Line | null>(null);
  const tooltipRef = useRef<fabric.Text | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  
  // State
  const [shiftKeyPressed, setShiftKeyPressed] = useState(initialShiftKeyPressed);
  const [snapToGrid, setSnapToGrid] = useState(initialSnapToGrid);
  const [anglesEnabled, setAnglesEnabled] = useState(initialAnglesEnabled);
  
  // Sub-hooks
  const {
    isDrawing,
    startPoint,
    currentPoint,
    currentLine,
    setIsDrawing,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    resetDrawingState
  } = useLineDrawingState();
  const {
    snapPointToGrid
  } = useSnapToGrid();
  const {
    createLine,
    updateLine,
    createOrUpdateTooltip,
    finalizeLine,
    removeLine
  } = useLineDrawing(fabricCanvasRef, lineColor, lineThickness, saveCurrentState || (() => {}));
  const {
    tooltipPosition,
    measurement,
    visible
  } = useLiveDistanceTooltip({
    isDrawing,
    startPoint,
    currentPoint,
    onMeasurement: (measurement: MeasurementData) => {
      //console.log('Measurement:', measurement);
    }
  });
  const {
    isToolInitialized,
    initializeTool
  } = useToolInitialization({
    fabricCanvasRef
  });
  const {
    calculateDistance,
    calculateAngle,
    getMeasurements
  } = useMeasurementCalculation();
  
  // Initialize handlers (empty for now)
  const {
    toggleSnap,
    toggleAngles,
    startDrawing,
    continueDrawing,
    completeDrawing
  } = useLineToolHandlers({
    lineState: {
      isDrawing,
      startPoint,
      currentPoint,
      currentLine
    },
    fabricCanvasRef,
    shiftKeyPressed
  });
  
  // Result for the line tool
  const result = useLineToolResult({
    isDrawing,
    enabled: isEnabled,
    inputMethod: InputMethod.MOUSE,
    snapEnabled: snapToGrid,
    startPointRef,
    currentLineRef,
    toggleSnap: () => {
      setSnapToGrid(!snapToGrid);
    }
  });
  
  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapToGrid(!snapToGrid);
  }, [snapToGrid]);
  
  // Handle pointer down event
  const handlePointerDown = useCallback((event: any) => {
    if (!fabricCanvasRef.current || !isEnabled) return;
    
    // Get pointer coordinates
    let pointer = fabricCanvasRef.current.getPointer(event.e);
    
    // Snap to grid if enabled
    if (snapToGrid) {
      pointer = snapPointToGrid(pointer);
    }
    
    // Set drawing state
    setIsDrawing(true);
    setStartPoint(pointer);
    setCurrentPoint(pointer);
    
    // Create new line
    const line = createLine(pointer.x, pointer.y);
    
    if (line) {
      setCurrentLine(line);
      currentLineRef.current = line;
    }
    
    // Log event
    toolsLogger.debug('Pointer down', { event, pointer });
  }, [
    fabricCanvasRef,
    isEnabled,
    snapToGrid,
    snapPointToGrid,
    setIsDrawing,
    setStartPoint,
    setCurrentPoint,
    createLine
  ]);
  
  // Handle pointer move event
  const handlePointerMove = useCallback((event: any) => {
    if (!isDrawing || !fabricCanvasRef.current || !currentLine) return;
    
    // Get pointer coordinates
    let pointer = fabricCanvasRef.current.getPointer(event.e);
    
    // Snap to grid if enabled
    if (snapToGrid) {
      pointer = snapPointToGrid(pointer);
    }
    
    // Update current point
    setCurrentPoint(pointer);
    
    // Update line
    updateLine(currentLine, startPoint!.x, startPoint!.y, pointer.x, pointer.y);
    
    // Log event
    toolsLogger.debug('Pointer move', { event, pointer });
  }, [
    isDrawing,
    fabricCanvasRef,
    snapToGrid,
    snapPointToGrid,
    setCurrentPoint,
    updateLine,
    currentLine,
    startPoint
  ]);
  
  // Handle pointer up event
  const handlePointerUp = useCallback((event: any) => {
    if (!isDrawing || !fabricCanvasRef.current || !currentLine) return;
    
    // Get pointer coordinates
    let pointer = fabricCanvasRef.current.getPointer(event.e);
    
    // Snap to grid if enabled
    if (snapToGrid) {
      pointer = snapPointToGrid(pointer);
    }
    
    // Finalize line
    finalizeLine(currentLine);
    
    // Reset drawing state
    resetDrawingState();
    
    // Log event
    toolsLogger.debug('Pointer up', { event, pointer });
  }, [
    isDrawing,
    fabricCanvasRef,
    snapToGrid,
    snapPointToGrid,
    finalizeLine,
    resetDrawingState,
    currentLine
  ]);
  
  // Handle drawing cancellation
  const cancelDrawing = useCallback(() => {
    if (currentLine) {
      removeLine(currentLine);
    }
    resetDrawingState();
    toolsLogger.debug('Drawing cancelled');
  }, [currentLine, removeLine, resetDrawingState]);
  
  // Handle key down event
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift' && !shiftKeyPressed) {
      setShiftKeyPressed(true);
      toolsLogger.debug('Shift key pressed');
    }
  }, [shiftKeyPressed]);
  
  // Handle key up event
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift' && shiftKeyPressed) {
      setShiftKeyPressed(false);
      toolsLogger.debug('Shift key released');
    }
  }, [shiftKeyPressed]);
  
  // Register event handlers
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isEnabled) return;
    
    // Add event listeners
    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Clean up event listeners
    return () => {
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
      
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    fabricCanvasRef,
    isEnabled,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp
  ]);
  
  // Initialize the tool when enabled
  useEffect(() => {
    if (isEnabled && !isToolInitialized) {
      initializeTool();
    }
  }, [isEnabled, isToolInitialized, initializeTool]);
  
  return result;
};
