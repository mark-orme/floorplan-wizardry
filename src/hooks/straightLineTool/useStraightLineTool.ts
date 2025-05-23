
import { useState, useCallback, useRef } from 'react';
import { Canvas, Line } from 'fabric';
import { Point, createPoint } from '@/types/core/Point';
import { MeasurementData } from './useStraightLineTool.d';
import { useGridSnapping } from '../useGridSnapping';
import { useLineToolState } from './useLineToolState';
import { InputMethod } from './useLineInputMethod';

export interface UseStraightLineToolProps {
  enabled?: boolean;
  isActive?: boolean;
  canvas: Canvas | null;
  lineColor: string;
  lineThickness: number;
  saveCurrentState?: () => void;
  shiftKeyPressed?: boolean;
}

export interface UseStraightLineToolResult {
  isActive: boolean;
  isEnabled: boolean;
  currentLine: Line | null;
  isToolInitialized: boolean;
  isDrawing: boolean;
  lineState: any;
  inputMethod: InputMethod;
  isPencilMode: boolean;
  snapEnabled: boolean;
  anglesEnabled: boolean;
  measurementData: MeasurementData;
  toggleGridSnapping: () => void;
  toggleAngles: () => void;
  toggleSnap: () => void;
  startDrawing: (point: Point) => void;
  startLine: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  updateLine: (point: Point) => void;
  endDrawing: () => void;
  completeDrawing: (point: Point) => void;
  completeLine: () => void;
  cancelDrawing: () => void;
  cancelLine: () => void;
  clearLines: () => void;
  handlePointerDown: (event: any) => void;
  handlePointerMove: (event: any) => void;
  handlePointerUp: (event: any) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  renderTooltip: () => React.ReactNode | null;
  setInputMethod: (method: InputMethod) => void;
  shiftKeyPressed: boolean;
  setCurrentLine: React.Dispatch<React.SetStateAction<Line | null>>;
  saveCurrentState: () => void;
}

/**
 * Hook for creating straight lines on canvas with enhanced functionality
 */
export const useStraightLineTool = ({
  enabled = false,
  isActive = false,
  canvas,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {},
  shiftKeyPressed = false
}: UseStraightLineToolProps): UseStraightLineToolResult => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | undefined>(undefined);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });

  // Use the line tool state for managing points
  const { lineState, startLine, updateLine, completeLine, cancelLine, clearLines } = useLineToolState({
    snapToGrid: snapEnabled,
    gridSize: 20
  });

  // Grid snapping hook
  const { snapToGrid } = useGridSnapping({
    gridSize: 20,
    enabled: snapEnabled
  });

  // Calculate and set measurement data
  const updateMeasurementData = useCallback((start: Point, end: Point) => {
    if (!start || !end) return;
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    setMeasurementData({
      distance,
      angle,
      snapped: snapEnabled,
      unit: 'px'
    });
  }, [snapEnabled]);

  // Toggle grid snapping
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  // Toggle angle snapping
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  // Toggle snapping 
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);

  // Start drawing a line
  const startDrawing = useCallback((point: Point) => {
    if (!canvas) return;
    
    // Create safe start point
    const safePoint = point || createPoint(0, 0);
    setStartPoint(safePoint);
    startLine(safePoint);
    
    // Create measurement data
    updateMeasurementData(safePoint, safePoint);
  }, [canvas, startLine, updateMeasurementData]);

  // Continue drawing (update line)
  const continueDrawing = useCallback((point: Point) => {
    if (!canvas || !lineState.isActive) return;
    
    // Use safe point
    const safePoint = point || createPoint(0, 0);
    updateLine(safePoint);
    
    // Update measurement if we have a start point
    if (startPoint) {
      updateMeasurementData(startPoint, safePoint);
    }
  }, [canvas, lineState.isActive, updateLine, startPoint, updateMeasurementData]);

  // Complete drawing the line
  const completeDrawing = useCallback((point: Point) => {
    if (!canvas || !lineState.isActive) return;
    
    // Finalize the line with the provided end point
    const safePoint = point || createPoint(0, 0);
    updateLine(safePoint);
    completeLine();
    
    // Save the current state for undo/redo
    saveCurrentState();
    
    // Clear the start point
    setStartPoint(undefined);
  }, [canvas, lineState.isActive, updateLine, completeLine, saveCurrentState]);

  // Handle pointer down (start drawing)
  const handlePointerDown = useCallback((event: any) => {
    if (!canvas || !enabled) return;
    
    const pointer = canvas.getPointer(event.e);
    startDrawing({
      x: pointer.x,
      y: pointer.y
    });
  }, [canvas, enabled, startDrawing]);

  // Handle pointer move (continue drawing)
  const handlePointerMove = useCallback((event: any) => {
    if (!canvas || !lineState.isActive) return;
    
    const pointer = canvas.getPointer(event.e);
    continueDrawing({
      x: pointer.x,
      y: pointer.y
    });
  }, [canvas, lineState.isActive, continueDrawing]);

  // Handle pointer up (complete drawing)
  const handlePointerUp = useCallback((event: any) => {
    if (!canvas || !lineState.isActive) return;
    
    const pointer = canvas.getPointer(event.e);
    completeDrawing({
      x: pointer.x,
      y: pointer.y
    });
  }, [canvas, lineState.isActive, completeDrawing]);

  // Handle key down event
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelLine();
      setStartPoint(undefined);
    }
  }, [cancelLine]);

  // Handle key up event
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Handle key up events
  }, []);

  // Placeholder for tooltip rendering
  const renderTooltip = useCallback(() => {
    // This would be implemented to render a tooltip
    return null;
  }, []);

  // Calculate if the tool is actually drawing
  const isDrawing = lineState.isActive;

  // Return the hook result with all required properties
  return {
    isActive: enabled || isActive,
    isEnabled: enabled,
    currentLine,
    isToolInitialized,
    isDrawing,
    lineState,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    toggleSnap,
    startDrawing,
    startLine,
    continueDrawing,
    updateLine,
    endDrawing: completeLine,
    completeDrawing,
    completeLine,
    cancelDrawing: cancelLine,
    cancelLine,
    clearLines,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleKeyUp,
    renderTooltip,
    setInputMethod,
    shiftKeyPressed,
    setCurrentLine,
    saveCurrentState
  };
};

export type { MeasurementData };
