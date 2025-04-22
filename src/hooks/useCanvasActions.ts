
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { convertToCoreFloorPlans, convertToUnifiedFloorPlans } from '@/utils/floorPlanAdapter';
import { CanvasAction } from '@/types/canvas';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createTestFloorPlan } from '@/utils/test/typedTestFixtures';

interface UseCanvasActionsProps {
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  initialFloorPlans?: FloorPlan[];
}

export const useCanvasActions = ({
  fabricCanvasRef,
  initialFloorPlans = []
}: UseCanvasActionsProps = {}) => {
  const [history, setHistory] = useState<CanvasAction[]>([]);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);

  // Get the canvas instance
  const getCanvas = useCallback((): FabricCanvas | null => {
    return fabricCanvasRef?.current || null;
  }, [fabricCanvasRef]);

  // Add a floor plan action
  const addFloorPlan = useCallback(() => {
    const newFloorPlan = createTestFloorPlan();
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setHistory(prev => [...prev, { type: 'add_floor_plan', floorPlanId: newFloorPlan.id }]);
  }, []);

  // Update floor plan action
  const updateFloorPlan = useCallback((index: number, floorPlan: FloorPlan) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      updated[index] = floorPlan;
      return updated;
    });
    setHistory(prev => [...prev, { 
      type: 'update_floor_plan', 
      floorPlanId: floorPlan.id,
      data: { index }
    }]);
  }, []);

  // Delete floor plan action
  const deleteFloorPlan = useCallback((index: number) => {
    const floorPlanId = floorPlans[index]?.id;
    if (!floorPlanId) return;

    setFloorPlans(prev => prev.filter((_, i) => i !== index));
    setHistory(prev => [...prev, { 
      type: 'delete_floor_plan', 
      floorPlanId
    }]);

    // Update current floor plan index if needed
    if (currentFloorPlanIndex >= index) {
      setCurrentFloorPlanIndex(prev => Math.max(0, prev - 1));
    }
  }, [floorPlans, currentFloorPlanIndex]);

  // Custom converter function for core floor plans
  const getCompatibleFloorPlans = useCallback(() => {
    // Instead of direct conversion using a type that might be incompatible,
    // we create a temp object that ensures all required properties are present
    const tempCorePlans = floorPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      label: plan.label,
      walls: plan.walls.map(wall => ({
        id: wall.id,
        start: wall.start,
        end: wall.end,
        thickness: wall.thickness,
        color: wall.color,
        roomIds: wall.roomIds || []
      })),
      rooms: plan.rooms,
      strokes: [],
      canvasData: plan.canvasData,
      canvasJson: plan.canvasJson,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      gia: plan.gia,
      level: plan.level,
      index: plan.index,
      metadata: {
        createdAt: plan.metadata.createdAt,
        updatedAt: plan.metadata.updatedAt,
        paperSize: plan.metadata.paperSize,
        level: plan.metadata.level
      }
    }));
    return tempCorePlans;
  }, [floorPlans]);

  return {
    getCanvas,
    history,
    floorPlans,
    currentFloorPlanIndex,
    setCurrentFloorPlanIndex,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    getCompatibleFloorPlans
  };
};
