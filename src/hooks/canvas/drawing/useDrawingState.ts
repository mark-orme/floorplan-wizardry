
/**
 * Canvas drawing state hook
 * Manages the state for canvas drawing operations
 * @module hooks/canvas/drawing/useDrawingState
 */
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Drawing state interface
 */
export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  activeTool: DrawingMode;
  lineColor: string;
  lineThickness: number;
}

/**
 * Drawing state hook result
 */
export interface UseDrawingStateResult {
  state: DrawingState;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: () => void;
  cancelDrawing: () => void;
  setActiveTool: (tool: DrawingMode) => void;
  setLineColor: (color: string) => void;
  setLineThickness: (thickness: number) => void;
}

/**
 * Hook for managing canvas drawing state
 * @param initialTool Initial drawing tool
 * @param initialColor Initial line color
 * @param initialThickness Initial line thickness
 * @returns Drawing state and setter functions
 */
export const useDrawingState = (
  initialTool: DrawingMode = DrawingMode.SELECT,
  initialColor: string = '#000000',
  initialThickness: number = 2
): UseDrawingStateResult => {
  const [state, setState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
    points: [],
    activeTool: initialTool,
    lineColor: initialColor,
    lineThickness: initialThickness
  });
  
  /**
   * Start drawing operation
   * @param point Starting point
   */
  const startDrawing = useCallback((point: Point): void => {
    setState(prevState => ({
      ...prevState,
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      points: [point]
    }));
  }, []);
  
  /**
   * Continue drawing operation
   * @param point Current point
   */
  const continueDrawing = useCallback((point: Point): void => {
    setState(prevState => {
      if (!prevState.isDrawing) return prevState;
      
      return {
        ...prevState,
        currentPoint: point,
        points: [...prevState.points, point]
      };
    });
  }, []);
  
  /**
   * End drawing operation
   */
  const endDrawing = useCallback((): void => {
    setState(prevState => ({
      ...prevState,
      isDrawing: false
    }));
  }, []);
  
  /**
   * Cancel drawing operation
   */
  const cancelDrawing = useCallback((): void => {
    setState(prevState => ({
      ...prevState,
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
      points: []
    }));
  }, []);
  
  /**
   * Set active drawing tool
   * @param tool Drawing tool
   */
  const setActiveTool = useCallback((tool: DrawingMode): void => {
    setState(prevState => ({
      ...prevState,
      activeTool: tool
    }));
  }, []);
  
  /**
   * Set line color
   * @param color Line color
   */
  const setLineColor = useCallback((color: string): void => {
    setState(prevState => ({
      ...prevState,
      lineColor: color
    }));
  }, []);
  
  /**
   * Set line thickness
   * @param thickness Line thickness
   */
  const setLineThickness = useCallback((thickness: number): void => {
    setState(prevState => ({
      ...prevState,
      lineThickness: thickness
    }));
  }, []);
  
  return {
    state,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    setActiveTool,
    setLineColor,
    setLineThickness
  };
};
