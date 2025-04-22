
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { useLineToolHandlers } from './useLineToolHandlers';
import { MeasurementData } from '@/types/measurement/MeasurementData';

export interface UseStraightLineToolOptions {
  isActive?: boolean;
  inputMethod?: InputMethod;
  isPencilMode?: boolean;
  setInputMethod?: (method: InputMethod) => void;
  canvas?: Canvas | null;
  enabled?: boolean;
  lineColor?: string;
  lineThickness?: number;
}

export interface UseStraightLineToolResult {
  isActive: boolean;
  isEnabled: boolean;
  currentLine: Line | null;
  isToolInitialized: boolean;
  isDrawing: boolean;
  inputMethod: InputMethod;
  isPencilMode: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData: MeasurementData;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: () => void;
  cancelDrawing: () => void;
  handlePointerDown: (event: any) => void;
  handlePointerMove: (event: any) => void;
  handlePointerUp: (event: any) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  renderTooltip: () => React.ReactNode;
  setInputMethod: (method: InputMethod) => void;
  shiftKeyPressed: boolean;
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
}

export const useStraightLineTool = (options: UseStraightLineToolOptions = {}): UseStraightLineToolResult => {
  const { 
    isActive = true, 
    inputMethod: initialInputMethod = InputMethod.MOUSE, 
    isPencilMode = false, 
    setInputMethod: externalSetInputMethod,
    canvas = null,
    enabled = true,
    lineColor = '#000000',
    lineThickness = 2
  } = options;
  
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled);
  const [isToolInitialized, setIsToolInitialized] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [anglesEnabled, setAnglesEnabled] = useState<boolean>(true);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'm'
  });

  // Use the standalone hook for input method
  const inputMethodState = useLineInputMethod();
  const actualInputMethod = externalSetInputMethod ? initialInputMethod : inputMethodState.inputMethod;
  const actualSetInputMethod = externalSetInputMethod || inputMethodState.setInputMethod;

  const handlers = useLineToolHandlers({
    isDrawing,
    setIsDrawing,
    currentLine,
    setCurrentLine,
    snapEnabled,
    anglesEnabled,
    measurementData,
    setMeasurementData,
    toggleGridSnapping: () => setSnapEnabled(prev => !prev),
    toggleAngles: () => setAnglesEnabled(prev => !prev),
    shiftKeyPressed,
    setShiftKeyPressed,
    isActive,
    inputMethod: actualInputMethod,
    isPencilMode,
    setInputMethod: actualSetInputMethod,
    lineColor
  });
  
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  return {
    isActive,
    isEnabled,
    currentLine,
    isToolInitialized,
    isDrawing,
    inputMethod: actualInputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    startDrawing: handlers.startDrawing,
    continueDrawing: handlers.continueDrawing,
    endDrawing: handlers.endDrawing,
    cancelDrawing: handlers.cancelDrawing,
    handlePointerDown: handlers.handlePointerDown,
    handlePointerMove: handlers.handlePointerMove,
    handlePointerUp: handlers.handlePointerUp,
    handleKeyDown: handlers.handleKeyDown,
    handleKeyUp: handlers.handleKeyUp,
    renderTooltip: handlers.renderTooltip,
    setInputMethod: actualSetInputMethod,
    shiftKeyPressed,
    setCurrentLine
  };
};
