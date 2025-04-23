
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
  enabled?: boolean; // Alias for isEnabled for backward compatibility
  canvas: Canvas | null;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
  // Add shiftKeyPressed for test compatibility
  shiftKeyPressed?: boolean;
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
  enabled, // For backward compatibility
  canvas,
  lineColor,
  lineThickness,
  saveCurrentState = () => {
    console.log('State saved');
  },
  shiftKeyPressed: initialShiftKeyPressed // For test compatibility
}: UseStraightLineToolProps) => {
  // Use either isEnabled or enabled for backward compatibility
  const isToolEnabled = isEnabled || enabled || false;
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(initialShiftKeyPressed || false);
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
    if (!isToolEnabled) return;
    const point = { x: event.pageX, y: event.pageY };
    startDrawing(point);
  }, [isToolEnabled, startDrawing]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isToolEnabled || !isDrawing) return;
    const point = { x: event.pageX, y: event.pageY };
    continueDrawing(point);
  }, [isToolEnabled, isDrawing, continueDrawing]);

  const handlePointerUp = useCallback((event: any) => {
    if (!isToolEnabled || !isDrawing) return;
    const point = { x: event.pageX, y: event.pageY };
    completeDrawing(point);
  }, [isToolEnabled, isDrawing, completeDrawing]);

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
  const isActive = isToolEnabled;

  // Render tooltip function that returns a React node
  const renderTooltip = useCallback((): ReactNode => {
    if (!isDrawing || !measurementData) return null;
    // In a .ts file we return null instead of JSX
    return null;
  }, [isDrawing, measurementData]);

  return {
    isEnabled: isToolEnabled,
    isActive, // For backward compatibility
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

// Export the type to fix imports in other files
export type UseStraightLineToolResult = ReturnType<typeof useStraightLineTool>;
