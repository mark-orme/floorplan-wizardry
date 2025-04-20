
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan, Stroke } from '@/types/floorPlanTypes';
import { Point } from '@/types/canvas';

interface UseFloorPlanDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  floorPlan: FloorPlan;
  setFloorPlan: (floorPlan: FloorPlan | ((prev: FloorPlan) => FloorPlan)) => void;
}

export const useFloorPlanDrawing = ({
  fabricCanvasRef,
  tool,
  floorPlan,
  setFloorPlan
}: UseFloorPlanDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);

  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setDrawingPoints([point]);
    setCurrentPoint(point);
  }, []);

  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing) return;
    
    setDrawingPoints(prev => [...prev, point]);
    setCurrentPoint(point);
  }, [isDrawing]);

  const endDrawing = useCallback((point: Point) => {
    if (!isDrawing) return;
    
    const updatedPoints = [...drawingPoints, point];
    setDrawingPoints(updatedPoints);
    setCurrentPoint(null);
    setIsDrawing(false);
    
    // Create new stroke based on tool type
    const newStroke: Stroke = {
      id: uuidv4(),
      points: updatedPoints,
      type: tool === DrawingMode.LINE ? 'line' : 'polyline',
      color: '#000000',
      thickness: 2,
      width: 2
    };
    
    // Update floor plan with new stroke
    setFloorPlan(prev => ({
      ...prev,
      strokes: [...(prev.strokes || []), newStroke],
      updatedAt: new Date().toISOString()
    }));
  }, [isDrawing, drawingPoints, tool, setFloorPlan]);

  const addStroke = useCallback((stroke: Stroke) => {
    setFloorPlan(prev => ({
      ...prev,
      strokes: [...(prev.strokes || []), stroke],
      updatedAt: new Date().toISOString()
    }));
  }, [setFloorPlan]);

  const calculateAreas = useCallback(() => {
    // Mock implementation
    return [100];
  }, []);

  return {
    isDrawing,
    drawingPoints,
    currentPoint,
    startDrawing,
    continueDrawing,
    endDrawing,
    addStroke,
    calculateAreas
  };
};
