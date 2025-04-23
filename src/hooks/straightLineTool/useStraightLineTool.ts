
import { useRef, useState, useCallback, useEffect } from 'react';
import { Point } from '@/types/core/Point';
import { Canvas, Line } from 'fabric';
import { useLineState } from './useLineState';
import { useLineToolHandlers } from './useLineToolHandlers';
import { InputMethod } from './useLineInputMethod';
import { UseStraightLineToolProps, UseStraightLineToolResult, MeasurementData } from '../useStraightLineTool.d';

// Use 'export type' to properly re-export the type
export type { MeasurementData };

export const useStraightLineTool = ({
  isEnabled = false,
  enabled = false, // Backward compatibility
  canvas,
  lineColor,
  lineThickness,
  saveCurrentState = () => {},
  shiftKeyPressed = false
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  // Use either isEnabled or enabled prop for backward compatibility
  const isToolEnabled = isEnabled || enabled;
  
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState<boolean>(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });

  // Update canvas reference when it changes
  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);

  // Get state and handlers from separate hooks
  const lineState = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });

  const handlers = useLineToolHandlers({
    lineState,
    fabricCanvasRef,
    shiftKeyPressed
  });

  // Custom setter for input method that validates the input
  const handleSetInputMethod = useCallback((method: InputMethod) => {
    setInputMethod(method);
  }, []);

  return {
    ...lineState,
    ...handlers,
    isActive: isToolEnabled,
    isEnabled: isToolEnabled,
    inputMethod,
    isPencilMode,
    measurementData,
    setInputMethod: handleSetInputMethod,
    shiftKeyPressed,
    saveCurrentState
  };
};

export default useStraightLineTool;
