
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StrokeTypeLiteral, Stroke } from '@/types/floorPlan';
import { Point } from '@/types/core/Point';

export interface DrawingStateOptions {
  defaultColor?: string;
  defaultThickness?: number;
  defaultType?: StrokeTypeLiteral;
}

export const useDrawingState = (options: DrawingStateOptions = {}) => {
  const {
    defaultColor = '#000000',
    defaultThickness = 2,
    defaultType = 'line'
  } = options;
  
  const [activeColor, setActiveColor] = useState(defaultColor);
  const [activeThickness, setActiveThickness] = useState(defaultThickness);
  const [activeType, setActiveType] = useState<StrokeTypeLiteral>(defaultType);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const startStroke = useCallback((point: Point) => {
    const newStroke: Stroke = {
      id: uuidv4(),
      points: [point],
      color: activeColor,
      thickness: activeThickness,
      width: activeThickness,
      type: activeType
    };
    
    setCurrentStroke(newStroke);
    setIsDrawing(true);
    
    return newStroke;
  }, [activeColor, activeThickness, activeType]);
  
  const updateStroke = useCallback((point: Point) => {
    if (!currentStroke || !isDrawing) return null;
    
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    };
    
    setCurrentStroke(updatedStroke);
    
    return updatedStroke;
  }, [currentStroke, isDrawing]);
  
  const endStroke = useCallback(() => {
    setIsDrawing(false);
    
    const finishedStroke = currentStroke;
    setCurrentStroke(null);
    
    return finishedStroke;
  }, [currentStroke]);
  
  const cancelStroke = useCallback(() => {
    setIsDrawing(false);
    setCurrentStroke(null);
  }, []);
  
  return {
    activeColor,
    setActiveColor,
    activeThickness,
    setActiveThickness,
    activeType,
    setActiveType,
    currentStroke,
    isDrawing,
    startStroke,
    updateStroke,
    endStroke,
    cancelStroke
  };
};
