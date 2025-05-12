
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';

export interface LineState {
  isDrawing: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
  lines: { start: Point; end: Point }[];
  pendingLine: { start: Point; end: Point } | null;
}

export interface UseLineStateOptions {
  initialState?: Partial<LineState>;
  fabricCanvasRef?: React.MutableRefObject<any>;
  snapEnabled?: boolean;
  continueDrawing?: (point: Point) => void;
  completeDrawing?: () => void;
}

export const useLineState = (options: UseLineStateOptions = {}) => {
  const { initialState = {} } = options;
  
  const [lineState, setLineState] = useState<LineState>({
    isDrawing: false,
    startPoint: null,
    endPoint: null,
    lines: [],
    pendingLine: null,
    ...initialState
  });
  
  const startLine = useCallback((point: Point) => {
    setLineState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: point,
      pendingLine: { start: point, end: point }
    }));
  }, []);
  
  const updateLine = useCallback((point: Point) => {
    setLineState(prev => {
      if (!prev.isDrawing || !prev.startPoint) return prev;
      
      return {
        ...prev,
        endPoint: point,
        pendingLine: { start: prev.startPoint, end: point }
      };
    });
  }, []);
  
  const completeLine = useCallback(() => {
    setLineState(prev => {
      if (!prev.isDrawing || !prev.startPoint || !prev.endPoint) return prev;
      
      const newLine = { start: prev.startPoint, end: prev.endPoint };
      return {
        ...prev,
        isDrawing: false,
        lines: [...prev.lines, newLine],
        pendingLine: null
      };
    });
  }, []);
  
  const cancelLine = useCallback(() => {
    setLineState(prev => ({
      ...prev,
      isDrawing: false,
      pendingLine: null
    }));
  }, []);
  
  const clearLines = useCallback(() => {
    setLineState(prev => ({
      ...prev,
      isDrawing: false,
      lines: [],
      pendingLine: null
    }));
  }, []);
  
  return {
    lineState,
    startLine,
    updateLine,
    completeLine,
    cancelLine,
    clearLines
  };
};
