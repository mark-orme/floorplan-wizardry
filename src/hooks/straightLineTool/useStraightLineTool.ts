
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
  const [isToolInitialized, setIsToolInitialized] = useState(true);

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
    completeDrawing,
    cancelDrawing
  } = useLineState({
    fabricCanvasRef,
    lineColor,
    lineThickness,
    saveCurrentState
  });

  // Add these missing handlers for compatibility
  const handlePointerDown = useCallback((event: any) => {
    if (!isEnabled) return;
    const point = { x: event.pageX, y: event.pageY };
    startDrawing(point);
  }, [isEnabled, startDrawing]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isEnabled || !isDrawing) return;
    const point = { x: event.pageX, y: event.pageY };
    continueDrawing(point);
  }, [isEnabled, isDrawing, continueDrawing]);

  const handlePointerUp = useCallback((event: any) => {
    if (!isEnabled || !isDrawing) return;
    const point = { x: event.pageX, y: event.pageY };
    completeDrawing(point);
  }, [isEnabled, isDrawing, completeDrawing]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setShiftKeyPressed(true);
    }
    if (event.key === 'Escape') {
      cancelDrawing();
    }
  }, [cancelDrawing]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      setShiftKeyPressed(false);
    }
  }, []);

  // For backward compatibility
  const endDrawing = completeDrawing;
  const toggleGridSnapping = toggleSnap;

  // Render tooltip function that returns a React node
  const renderTooltip = useCallback((): ReactNode => {
    if (!isDrawing || !measurementData) return null;
    // In a .ts file we return null instead of JSX
    return null;
  }, [isDrawing, measurementData]);

  return {
    isEnabled,
    isActive: isEnabled, // For backward compatibility
    isDrawing,
    isToolInitialized,
    snapEnabled,
    anglesEnabled,
    currentLine,
    measurementData,
    shiftKeyPressed,
    toggleSnap,
    toggleAngles,
    toggleGridSnapping, // Alias for toggleSnap
    setCurrentLine,
    startDrawing,
    continueDrawing,
    endDrawing,     // Alias for completeDrawing
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
