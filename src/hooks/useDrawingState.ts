
import { useState, useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingState, createDefaultDrawingState } from '@/types/fabric-unified';

export const useDrawingState = () => {
  const [currentTool, setCurrentTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  
  const startDrawing = useCallback((x: number, y: number) => {
    setDrawingState((prev: DrawingState) => ({
      ...prev,
      isDrawing: true,
      startPoint: { x, y },
      currentPoint: { x, y },
      points: [{ x, y }]
    }));
  }, []);
  
  const updateDrawing = useCallback((x: number, y: number) => {
    setDrawingState((prev: DrawingState) => {
      if (!prev.isDrawing) return prev;
      
      return {
        ...prev,
        currentPoint: { x, y },
        points: [...prev.points, { x, y }]
      };
    });
  }, []);
  
  const endDrawing = useCallback(() => {
    setDrawingState((prev: DrawingState) => ({
      ...prev,
      isDrawing: false
    }));
  }, []);
  
  const cancelDrawing = useCallback(() => {
    setDrawingState(createDefaultDrawingState());
  }, []);
  
  const updateCursorPosition = useCallback((x: number, y: number) => {
    setDrawingState((prev: DrawingState) => ({
      ...prev,
      cursorPosition: { x, y }
    }));
  }, []);
  
  return {
    currentTool,
    setCurrentTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    drawingState,
    startDrawing,
    updateDrawing,
    endDrawing,
    cancelDrawing,
    updateCursorPosition
  };
};
