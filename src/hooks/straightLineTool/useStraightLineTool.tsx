import { useState, useCallback, useEffect, useRef } from 'react';
import { Line } from 'fabric';
import { useLineDrawingState } from './useLineDrawingState';
import { useLineInitialization } from './useLineInitialization';
import { useLineInteraction } from './useLineInteraction';
import { useMeasurementCalculation } from './useMeasurementCalculation';
import { useLiveDistanceTooltip } from './useLiveDistanceTooltip';
import { useLineAngleSnap } from './useLineAngleSnap';
import { useGridSnapping } from '@/hooks/useGridSnapping';
import { useLineOperations } from './useLineOperations';
import { UseStraightLineToolOptions } from './useStraightLineToolOptions';
import { InputMethod } from '@/types/input/InputMethod';
import { toolsLogger } from '@/utils/logger';
import { FabricPointerEvent } from '@/types/fabricEvents';
import { useObjectSelection } from '@/hooks/useObjectSelection';
import { useCanvasEvents } from '@/hooks/useCanvasEvents';
import { useKeyboardEvents } from '@/hooks/useKeyboardEvents';
import { MeasurementData } from '@/types/measurement/MeasurementData';

export interface UseStraightLineToolProps {
  isActive?: boolean;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  saveCurrentState?: () => void;
  anglesEnabled?: boolean;
}

/**
 * Hook for implementing a straight line drawing tool
 */
export const useStraightLineTool = (props: UseStraightLineToolProps = {}) => {
  const {
    isActive: propIsActive = false,
    lineColor = 'black',
    lineThickness = 2,
    snapToGrid: propSnapToGrid = false,
    saveCurrentState,
    anglesEnabled: propAnglesEnabled = false
  } = props;
  
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
    isActive,
    isToolInitialized,
    setIsActive,
    initializeTool,
    initializeLine,
    cleanupLine,
    lineRef
  } = useLineInitialization();
  
  const {
    startDrawing,
    updateLine,
    completeDrawing,
    cancelDrawing
  } = useLineInteraction();
  
  const {
    calculateDistance,
    calculateAngle,
    getMeasurements
  } = useMeasurementCalculation();
  
  const {
    tooltipPosition,
    measurement,
    visible: tooltipVisible
  } = useLiveDistanceTooltip({
    isDrawing,
    startPoint,
    currentPoint,
    onMeasurement: (measurement: MeasurementData) => {
      // Optional: Handle measurement updates
    }
  });
  
  const {
    anglesEnabled,
    setAnglesEnabled,
    snapToAngle,
    toggleAngles
  } = useLineAngleSnap({ enabled: propAnglesEnabled });
  
  const {
    snapEnabled,
    setSnapEnabled,
    snapToGrid,
    toggleSnap
  } = useGridSnapping({ enabled: propSnapToGrid });
  
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  
  /**
   * Create line on canvas
   */
  const createLine = useCallback((
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    if (!fabricCanvasRef.current) return null;
    
    const line = new Line([x1, y1, x2, y2], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false
    });
    
    fabricCanvasRef.current.add(line);
    return line;
  }, [lineColor, lineThickness]);
  
  /**
   * Update line on canvas
   */
  const updateLineOnCanvas = useCallback((
    line: Line,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    line.set({ x1, y1, x2, y2 });
    fabricCanvasRef.current?.renderAll();
  }, []);
  
  /**
   * Finalize line on canvas
   */
  const finalizeLineOnCanvas = useCallback((
    line: Line,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    line.set({
      x1,
      y1,
      x2,
      y2,
      selectable: true,
      evented: true
    });
    
    fabricCanvasRef.current?.renderAll();
    saveCurrentState?.();
  }, [saveCurrentState]);
  
  /**
   * Remove line from canvas
   */
  const removeLineFromCanvas = useCallback((line: Line) => {
    fabricCanvasRef.current?.remove(line);
  }, []);
  
  const {
    startDrawingOperation,
    continueDrawingOperation,
    completeDrawingOperation,
    cancelDrawingOperation
  } = useLineOperations(
    fabricCanvasRef,
    createLine,
    updateLineOnCanvas,
    finalizeLineOnCanvas,
    removeLineFromCanvas
  );
  
  // Initialize canvas event handling
  const {
    handlePointerDown: handleCanvasPointerDown,
    handlePointerMove: handleCanvasPointerMove,
    handlePointerUp: handleCanvasPointerUp,
    handleKeyDown,
    handleKeyUp,
    shiftKeyPressed,
  } = useCanvasEvents();
  
  /**
   * Handle pointer down event
   * @param event Fabric pointer event
   */
  const handlePointerDown = useCallback((event: FabricPointerEvent) => {
    if (!isActive || !fabricCanvasRef.current) return;
    
    const point = fabricCanvasRef.current.getPointer(event.e);
    
    startDrawingOperation(
      point,
      setIsActive,
      setIsDrawing,
      setStartPoint,
      setCurrentPoint,
      setCurrentLine
    );
    
    handleCanvasPointerDown(event);
  }, [isActive, startDrawingOperation, setIsActive, setIsDrawing, setStartPoint, setCurrentPoint, setCurrentLine, handleCanvasPointerDown]);
  
  /**
   * Handle pointer move event
   * @param event Fabric pointer event
   */
  const handlePointerMove = useCallback((event: FabricPointerEvent) => {
    if (!isActive || !fabricCanvasRef.current) return;
    
    const point = fabricCanvasRef.current.getPointer(event.e);
    
    continueDrawingOperation(
      point,
      isDrawing,
      startPoint,
      currentLine,
      snapToGrid,
      snapToAngle,
      snapEnabled,
      anglesEnabled,
      setCurrentPoint
    );
    
    handleCanvasPointerMove(event);
  }, [isActive, continueDrawingOperation, isDrawing, startPoint, currentLine, snapToGrid, snapToAngle, snapEnabled, anglesEnabled, setCurrentPoint, handleCanvasPointerMove]);
  
  /**
   * Handle pointer up event
   */
  const handlePointerUp = useCallback((event: FabricPointerEvent) => {
    if (!isActive || !fabricCanvasRef.current) return;
    
    if (event.e) {
      const point = fabricCanvasRef.current.getPointer(event.e);
      
      completeDrawingOperation(
        point,
        isDrawing,
        startPoint,
        currentLine,
        snapToGrid,
        snapToAngle,
        snapEnabled,
        anglesEnabled,
        resetDrawingState
      );
    }
    
    handleCanvasPointerUp(event);
  }, [isActive, completeDrawingOperation, isDrawing, startPoint, currentLine, snapToGrid, snapToAngle, snapEnabled, anglesEnabled, resetDrawingState, handleCanvasPointerUp]);
  
  /**
   * Handle tool deactivation
   */
  const handleToolDeactivation = useCallback(() => {
    cancelDrawingOperation(
      isDrawing,
      currentLine,
      resetDrawingState
    );
  }, [cancelDrawingOperation, isDrawing, currentLine, resetDrawingState]);
  
  /**
   * Render tooltip
   */
  const renderTooltip = useCallback(() => {
    if (!tooltipVisible || !tooltipPosition || !measurement) return null;
    
    return (
      
        {measurement.distance.toFixed(2)} px ({measurement.angle.toFixed(2)}°)
      
    );
  }, [tooltipVisible, tooltipPosition, measurement]);
  
  useEffect(() => {
    setIsActive(propIsActive);
  }, [propIsActive, setIsActive]);
  
  return {
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    shiftKeyPressed,
    isActive,
    renderTooltip,
    isDrawing,
    currentLine,
  };
};
