
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { useLineToolHandlers } from './useLineToolHandlers';
import { MeasurementData } from '@/types/measurement/MeasurementData';

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

export const useStraightLineTool = (): UseStraightLineToolResult => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isToolInitialized, setIsToolInitialized] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [anglesEnabled, setAnglesEnabled] = useState<boolean>(true);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  const { inputMethod, setInputMethod } = useLineInputMethod();
  const [isPencilMode, setIsPencilMode] = useState<boolean>(false);
  
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'm'
  });

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
    inputMethod,
    isPencilMode,
    setInputMethod
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
    inputMethod,
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
    setInputMethod,
    shiftKeyPressed,
    setCurrentLine
  };
};
