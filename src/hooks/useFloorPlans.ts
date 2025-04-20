
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { useFloorPlanDrawing, UseFloorPlanDrawingProps } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';

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
  // State for floor plans
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(defaultFloorIndex);
  const [gia, setGia] = useState(0);
  
  // Get current floor plan
  const currentFloorPlan = floorPlans[currentFloorIndex] || null;
  
  // Initialize floor plan drawing hook
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
  
  // Memoize the drawFloorPlan function
  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    if (!drawingHook.drawFloorPlan) {
      console.error('drawFloorPlan function not available');
      return;
    }
    
    drawingHook.drawFloorPlan(canvas, floorPlan);
  }, [drawingHook.drawFloorPlan]);
  
  // Add a new floor plan
  const addFloorPlan = useCallback(() => {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: 'A4',
        level: floorPlans.length
      },
      data: {},
      userId: 'default-user'
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloorIndex(floorPlans.length);
  }, [floorPlans.length]);
  
  // Remove a floor plan
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
