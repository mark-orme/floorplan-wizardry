
import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { InputMethod } from '@/types/input/InputMethod';
import { useMeasurementCalculation } from './useMeasurementCalculation';
import { useLiveDistanceTooltip } from './useLiveDistanceTooltip';
import { useLineState } from './useLineState';
import { ReactNode } from 'react';

export interface UseStraightLineToolProps {
  isEnabled?: boolean;
  canvas: Canvas | null;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
}

export interface MeasurementData {
  distance: number | null;
  angle: number | null;
  snapped: boolean;
  unit: string;
  snapType?: 'grid' | 'angle' | 'both';
}

export const useStraightLineTool = ({
  isEnabled = false,
  canvas,
  lineColor,
  lineThickness,
  saveCurrentState = () => {
    console.log('State saved');
  }
}: UseStraightLineToolProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });

  const fabricCanvasRef = useRef<Canvas | null>(canvas);
  const { calculateMeasurements } = useMeasurementCalculation();
  const { formatTooltipData } = useLiveDistanceTooltip();

  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);

  const {
    snapEnabled,
    anglesEnabled,
    toggleSnap,
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
    handleKeyUp
  } = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });

  // Render tooltip function that returns a React node
  const renderTooltip = useCallback((): ReactNode => {
    if (!isDrawing || !measurementData) return null;
    const tooltipData = formatTooltipData(measurementData);
    if (!tooltipData) return null;
    return (
      <div className="absolute bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
        {tooltipData.distanceDisplay} {tooltipData.angleDisplay}
        {tooltipData.snappedInfo}
      </div>
    );
  }, [isDrawing, measurementData, formatTooltipData]);

  return {
    isEnabled,
    isDrawing,
    snapEnabled,
    anglesEnabled,
    currentLine,
    measurementData,
    shiftKeyPressed,
    toggleSnap,
    toggleAngles,
    setCurrentLine,
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
    renderTooltip
  };
};
