
import { useState, useCallback } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/types/DrawingMode';
import { Point } from '@/types/core/Point';

export interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
  points: Point[];
  distance?: number;
  cursorPosition?: Point | null;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  pathStartPoint?: Point | null;
  currentPath?: any;
  zoomLevel?: number;
}

export const defaultDrawingState: DrawingState = {
  isDrawing: false,
  startPoint: null,
  currentPoint: null,
  points: [],
  distance: 0,
  cursorPosition: null,
  tool: DrawingMode.SELECT,
  lineColor: '#000000',
  lineThickness: 2,
  pathStartPoint: null,
  currentPath: null,
  zoomLevel: 1
};

export interface UseCanvasControllerDrawingStateProps {
  canvas: Canvas | null;
}

export const useCanvasControllerDrawingState = ({ canvas }: UseCanvasControllerDrawingStateProps) => {
  const [drawingState, setDrawingState] = useState<DrawingState>(defaultDrawingState);

  const startDrawing = useCallback((point: Point) => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      points: [point]
    }));
  }, []);

  const continueDrawing = useCallback((point: Point) => {
    setDrawingState(prev => {
      if (!prev.isDrawing) return prev;
      return {
        ...prev,
        currentPoint: point,
        points: [...prev.points, point]
      };
    });
  }, []);

  const endDrawing = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false
    }));
  }, []);

  const handleMouseDown = useCallback((e: any) => {
    if (!canvas || drawingState.tool === DrawingMode.SELECT) return;
    
    const pointer = canvas.getPointer(e.e);
    startDrawing({ x: pointer.x, y: pointer.y });
  }, [canvas, drawingState.tool, startDrawing]);

  const handleMouseMove = useCallback((e: any) => {
    if (!canvas || !drawingState.isDrawing) return;
    
    const pointer = canvas.getPointer(e.e);
    continueDrawing({ x: pointer.x, y: pointer.y });
  }, [canvas, drawingState.isDrawing, continueDrawing]);

  const handleMouseUp = useCallback(() => {
    if (!canvas || !drawingState.isDrawing) return;
    
    endDrawing();
  }, [canvas, drawingState.isDrawing, endDrawing]);

  return {
    drawingState,
    setDrawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    startDrawing,
    continueDrawing,
    endDrawing
  };
};
