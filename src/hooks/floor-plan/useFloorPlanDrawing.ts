
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan, Stroke } from '@/types/floorPlanTypes';
import { Point } from '@/types/floorPlanTypes';
import { trackTypeError } from '@/utils/sentry/typeMonitoring';

export interface UseFloorPlanDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  floorPlan: FloorPlan;
  setFloorPlan: (floorPlan: FloorPlan | ((prev: FloorPlan) => FloorPlan)) => void;
  // Optional properties
  onDrawComplete?: () => void;
  gridLayerRef?: React.MutableRefObject<any[]>;
  setGia?: React.Dispatch<React.SetStateAction<number>>;
}

export interface UseFloorPlanDrawingResult {
  isDrawing: boolean;
  drawingPoints: Point[];
  currentPoint: Point | null;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: (point: Point) => void;
  cancelDrawing: () => void;
  addStroke: (stroke: Stroke) => void;
  calculateAreas: () => number[];
  drawFloorPlan: (canvas: FabricCanvas, plan: FloorPlan) => void;
}

export const useFloorPlanDrawing = ({
  fabricCanvasRef,
  tool,
  floorPlan,
  setFloorPlan,
  onDrawComplete,
  gridLayerRef,
  setGia
}: UseFloorPlanDrawingProps): UseFloorPlanDrawingResult => {
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
    
    // Validate that floorPlan has the required properties
    if (!floorPlan.strokes) {
      trackTypeError('FloorPlan missing strokes property', { floorPlanId: floorPlan.id });
      floorPlan.strokes = [];
    }
    
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
    setFloorPlan(prev => {
      if (!prev.strokes) {
        trackTypeError('Previous FloorPlan missing strokes property', { floorPlanId: prev.id });
        prev.strokes = [];
      }
      
      return {
        ...prev,
        strokes: [...(prev.strokes || []), newStroke],
        updatedAt: new Date().toISOString()
      };
    });
    
    // Call the onDrawComplete callback if it exists
    if (onDrawComplete) {
      onDrawComplete();
    }
  }, [isDrawing, drawingPoints, tool, setFloorPlan, onDrawComplete, floorPlan]);

  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawingPoints([]);
    setCurrentPoint(null);
  }, []);

  const addStroke = useCallback((stroke: Stroke) => {
    // Validate that the provided stroke has all required properties
    if (!stroke.type) {
      trackTypeError('Stroke missing type property', { strokeId: stroke.id });
      stroke.type = 'line';
    }
    
    setFloorPlan(prev => {
      if (!prev.strokes) {
        trackTypeError('Previous FloorPlan missing strokes property', { floorPlanId: prev.id });
        prev.strokes = [];
      }
      
      return {
        ...prev,
        strokes: [...(prev.strokes || []), stroke],
        updatedAt: new Date().toISOString()
      };
    });
    
    // Call the onDrawComplete callback if it exists
    if (onDrawComplete) {
      onDrawComplete();
    }
  }, [setFloorPlan, onDrawComplete]);

  const calculateAreas = useCallback(() => {
    // Calculate the areas of all rooms in the floor plan
    if (!floorPlan || !floorPlan.rooms) {
      trackTypeError('FloorPlan missing rooms property', { floorPlanId: floorPlan?.id });
      return [0];
    }
    
    return floorPlan.rooms.map(room => room.area);
  }, [floorPlan]);

  // Add a drawFloorPlan method for compatibility with useFloorPlans hook
  const drawFloorPlan = useCallback((canvas: FabricCanvas, plan: FloorPlan) => {
    if (!canvas) return;
    
    console.log('Drawing floor plan:', plan.name);
    
    // Clear existing objects except grid
    const nonGridObjects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
    nonGridObjects.forEach(obj => canvas.remove(obj));
    
    // Validate that the floor plan has all required properties
    if (!plan.strokes) {
      trackTypeError('FloorPlan missing strokes property', { floorPlanId: plan.id });
      plan.strokes = [];
    }
    
    if (!plan.walls) {
      trackTypeError('FloorPlan missing walls property', { floorPlanId: plan.id });
      plan.walls = [];
    }
    
    if (!plan.rooms) {
      trackTypeError('FloorPlan missing rooms property', { floorPlanId: plan.id });
      plan.rooms = [];
    }
    
    // Draw strokes
    plan.strokes?.forEach(stroke => {
      // Implementation would draw each stroke on the canvas
      console.log('Drawing stroke:', stroke.id);
    });
    
    // Draw walls
    plan.walls?.forEach(wall => {
      // Implementation would draw each wall on the canvas
      console.log('Drawing wall:', wall.id);
    });
    
    // Draw rooms
    plan.rooms?.forEach(room => {
      // Implementation would draw each room on the canvas
      console.log('Drawing room:', room.id);
    });
    
    canvas.requestRenderAll();
  }, []);

  return {
    isDrawing,
    drawingPoints,
    currentPoint,
    startDrawing,
    continueDrawing,
    endDrawing,
    cancelDrawing,
    addStroke,
    calculateAreas,
    drawFloorPlan
  };
};
