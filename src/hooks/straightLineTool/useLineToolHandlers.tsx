import { useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '@/types/measurement/MeasurementData';
import { InputMethod } from './useLineInputMethod';
import React from 'react';

interface UseLineToolHandlersProps {
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  currentLine: Line | null;
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData: MeasurementData;
  setMeasurementData: (data: MeasurementData) => void;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  shiftKeyPressed: boolean;
  setShiftKeyPressed: (pressed: boolean) => void;
  isActive: boolean;
  inputMethod: InputMethod;
  isPencilMode: boolean;
  setInputMethod: (method: InputMethod) => void;
}

export const useLineToolHandlers = (props: UseLineToolHandlersProps) => {
  const { 
    isDrawing, 
    setIsDrawing, 
    currentLine, 
    setCurrentLine,
    snapEnabled,
    anglesEnabled,
    measurementData,
    setMeasurementData,
    toggleGridSnapping,
    toggleAngles,
    shiftKeyPressed,
    setShiftKeyPressed,
    isActive,
    inputMethod,
    isPencilMode,
    setInputMethod
  } = props;

  const startDrawing = useCallback((point: Point) => {
    console.log('Start drawing at', point);
    setIsDrawing(true);
    // Create line implementation here
  }, [setIsDrawing]);

  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !currentLine) return;
    console.log('Continue drawing to', point);
    // Update line here
  }, [isDrawing, currentLine]);

  const endDrawing = useCallback(() => {
    if (!isDrawing) return;
    console.log('End drawing');
    setIsDrawing(false);
    setCurrentLine(null);
  }, [isDrawing, setIsDrawing, setCurrentLine]);

  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return;
    console.log('Cancel drawing');
    setIsDrawing(false);
    setCurrentLine(null);
  }, [isDrawing, setIsDrawing, setCurrentLine]);

  const handlePointerDown = useCallback((event: any) => {
    if (!isActive) return;
    console.log('Pointer down', event);
    // Handle pointer down implementation
  }, [isActive]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isActive) return;
    console.log('Pointer move', event);
    // Handle pointer move implementation
  }, [isActive]);

  const handlePointerUp = useCallback((event: any) => {
    if (!isActive) return;
    console.log('Pointer up', event);
    // Handle pointer up implementation
  }, [isActive]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    console.log('Key down', event.key);
    
    // Handle shift key for angle constraints
    if (event.key === 'Shift') {
      setShiftKeyPressed(true);
    }
    
    // Handle key down implementation with escape for cancellation
    if (event.key === 'Escape') {
      cancelDrawing();
    }
  }, [isActive, setShiftKeyPressed, cancelDrawing]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    console.log('Key up', event.key);
    
    // Handle shift key release
    if (event.key === 'Shift') {
      setShiftKeyPressed(false);
    }
  }, [isActive, setShiftKeyPressed]);

  const renderTooltip = useCallback(() => {
    return <div>Line tool tooltip</div>;
  }, []);

  return {
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    renderTooltip
  };
};
