import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { v4 as uuidv4 } from 'uuid';
import type { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';
import { useFloorPlanDrawing } from '@/hooks/floor-plan/useFloorPlanDrawing';
import { DrawingMode } from '@/constants/drawingModes';
import { adaptFloorPlan } from '@/utils/typeAdapters';

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
  
  const now = new Date().toISOString();
  const safeFloorPlan = currentFloorPlan || adaptFloorPlan({
    id: 'empty',
    name: 'Empty Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
    data: {},
    userId: ''
  });
  
  const drawingHook = useFloorPlanDrawing({
    floorPlan: safeFloorPlan,
    fabricCanvasRef,
    tool,
    onFloorPlanUpdate: (floorPlan) => {
      setFloorPlans(prev => {
        const updated = [...prev];
        updated[currentFloorIndex] = floorPlan;
        return updated;
      });
    }
  });
  
  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    if (!drawingHook || !drawingHook.drawFloorPlan) {
      console.error('drawFloorPlan function not available');
      return;
    }
    
    drawingHook.drawFloorPlan(canvas, floorPlan);
  }, [drawingHook]);
  
  const addFloorPlan = useCallback(() => {
    const now = new Date().toISOString();
    const newFloorPlan = adaptFloorPlan({
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
      createdAt: now,
      updatedAt: now,
      metadata: {
        createdAt: now,
        updatedAt: now,
        paperSize: 'A4',
        level: floorPlans.length,
        version: '1.0',
        author: 'User',
        dateCreated: now,
        lastModified: now,
        notes: ''
      },
      data: {},
      userId: 'default-user'
    });
    
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
  
  const syncFloorPlans = useCallback(() => {
    console.log('syncFloorPlans called (compatibility function)');
  }, []);
  
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
    syncFloorPlans,
    ...drawingHook
  };
};
