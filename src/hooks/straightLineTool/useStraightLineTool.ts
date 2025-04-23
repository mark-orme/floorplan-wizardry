
import React from 'react';
import { useState, useCallback } from 'react';
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod, useLineInputMethod } from './useLineInputMethod';

// Define MeasurementData type for exports
export type MeasurementData = {
  distance: number;
  angle: number;
};

export interface UseStraightLineToolProps {
  isActive: boolean;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
}

export interface UseStraightLineToolResult {
  isDrawing: boolean;
  currentLine: Line | null;
  measurementData: MeasurementData;
  inputMethod: InputMethod;
  isPencilMode: boolean;
  toggleSnap: () => void;
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
  setIsDrawing: (isDrawing: boolean) => void;
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
}

export const useStraightLineTool = ({
  isActive = false,
  lineColor = '#000000',
  lineThickness = 1,
  snapToGrid = false
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(snapToGrid);
  const [anglesEnabled, setAnglesEnabled] = useState<boolean>(false);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({ distance: 0, angle: 0 });

  const { inputMethod, setInputMethod } = useLineInputMethod();
  const isPencilMode = inputMethod === InputMethod.STYLUS || inputMethod === InputMethod.PENCIL;

  // Toggle functions
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  // Drawing functions
  const startDrawing = useCallback((point: Point) => {
    if (!isActive) return;
    setIsDrawing(true);
    console.log('Starting drawing at', point);
    // Implementation for starting a line would go here
  }, [isActive]);

  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !isActive) return;
    console.log('Continuing drawing to', point);
    // Implementation for updating line would go here
  }, [isDrawing, isActive]);

  const endDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setCurrentLine(null);
    console.log('Ending drawing');
    // Implementation for completing a line would go here
  }, [isDrawing]);

  const cancelDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setCurrentLine(null);
    console.log('Canceling drawing');
    // Implementation for canceling would go here
  }, [isDrawing]);

  // Event handlers
  const handlePointerDown = useCallback((event: any) => {
    if (!isActive) return;
    // Implementation for pointer down
  }, [isActive]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isActive) return;
    // Implementation for pointer move
  }, [isActive]);

  const handlePointerUp = useCallback((event: any) => {
    if (!isActive) return;
    // Implementation for pointer up
  }, [isActive]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    if (event.key === 'Shift') {
      setShiftKeyPressed(true);
    }
    if (event.key === 'Escape') {
      cancelDrawing();
    }
  }, [isActive, cancelDrawing]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    if (event.key === 'Shift') {
      setShiftKeyPressed(false);
    }
  }, [isActive]);

  const renderTooltip = useCallback((): React.ReactNode => {
    return (
      <div>
        Distance: {measurementData.distance.toFixed(2)}
        Angle: {measurementData.angle.toFixed(2)}°
      </div>
    );
  }, [measurementData]);

  return {
    isDrawing,
    currentLine,
    measurementData,
    inputMethod,
    isPencilMode,
    toggleSnap,
    toggleAngles,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    renderTooltip,
    setIsDrawing,
    setCurrentLine
  };
};
