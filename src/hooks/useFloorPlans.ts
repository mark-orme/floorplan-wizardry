import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

export interface UseFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  defaultFloorIndex?: number;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
  tool?: DrawingMode;
}

export const useFloorPlans = ({
  initialFloorPlans = [],
  defaultFloorIndex = 0,
  fabricCanvasRef,
  gridLayerRef,
  tool = DrawingMode.SELECT
}: UseFloorPlansProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(defaultFloorIndex);
  const [gia, setGia] = useState(0);
  
  const currentFloorPlan = floorPlans[currentFloorIndex] || null;
  
  const drawingHook = useFloorPlanDrawing({
    fabricCanvasRef,
    tool,
    floorPlan: currentFloorPlan as FloorPlan,
    setFloorPlan: (floorPlan) => {
      if (typeof floorPlan === 'function') {
        setFloorPlans(prev => {
          const updated = [...prev];
          updated[currentFloorIndex] = floorPlan(prev[currentFloorIndex]);
          return updated;
        });
      } else {
        setFloorPlans(prev => {
          const updated = [...prev];
          updated[currentFloorIndex] = floorPlan;
          return updated;
        });
      }
    }
  });
  
  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    if (!drawingHook.drawFloorPlan) {
      console.error('drawFloorPlan function not available');
      return;
    }
    
    drawingHook.drawFloorPlan(canvas, floorPlan);
  }, [drawingHook.drawFloorPlan]);
  
  const addFloorPlan = useCallback(() => {
    const now = new Date().toISOString();
    const newFloorPlan: FloorPlan = {
      id: uuidv4(),
      name: `Floor ${floorPlans.length + 1}`,
      label: `Floor ${floorPlans.length + 1}`,
      index: floorPlans.length,
      level: floorPlans.length,
      walls: [],
      rooms: [],
      strokes: [],
      gia: 0,
      canvasData: null,
      canvasJson: null,
      canvasState: null,
      createdAt: now,
      updatedAt: now,
      metadata: createCompleteMetadata({
        level: floorPlans.length
      }),
      data: {},
      userId: 'default-user'
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloorIndex(floorPlans.length);
  }, [floorPlans.length]);
  
  const removeFloorPlan = useCallback((index: number) => {
    if (floorPlans.length <= 1) {
      console.warn('Cannot remove the last floor plan');
      return;
    }
    
    setFloorPlans(prev => prev.filter((_, i) => i !== index));
    
    if (currentFloorIndex >= index) {
      setCurrentFloorIndex(prev => Math.max(0, prev - 1));
    }
  }, [floorPlans.length, currentFloorIndex]);
  
  return {
    floorPlans,
    setFloorPlans,
    currentFloorIndex,
    setCurrentFloorIndex,
    currentFloorPlan,
    addFloorPlan,
    removeFloorPlan,
    drawFloorPlan,
    gia,
    setGia,
    ...drawingHook
  };
};
