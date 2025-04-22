import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';
import { useLineToolHandlers } from './useLineToolHandlers';
import { UseStraightLineToolResult } from '@/types/hooks';
import { MeasurementData } from '@/types/measurement/MeasurementData';

export const useStraightLineTool = (): UseStraightLineToolResult => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isToolInitialized, setIsToolInitialized] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);
  const [anglesEnabled, setAnglesEnabled] = useState<boolean>(true);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
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
