
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { 
  CanvasAction, 
  createCanvasAction,
  AddFloorPlanAction,
  UpdateFloorPlanAction,
  DeleteFloorPlanAction
} from '@/types/canvas';
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
    
    // Use the createCanvasAction helper to ensure timestamp is added
    setHistory(prev => [
      ...prev, 
      createCanvasAction({
        type: 'add_floor_plan',
        floorPlanId: newFloorPlan.id
      }) as AddFloorPlanAction
    ]);
  }, []);

  // Update floor plan action
  const updateFloorPlan = useCallback((index: number, floorPlan: FloorPlan) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      updated[index] = floorPlan;
      return updated;
    });
    
    // Use the createCanvasAction helper to ensure timestamp is added
    setHistory(prev => [
      ...prev, 
      createCanvasAction({
        type: 'update_floor_plan',
        floorPlanId: floorPlan.id,
        data: { index }
      }) as UpdateFloorPlanAction
    ]);
  }, []);

  // Delete floor plan action
  const deleteFloorPlan = useCallback((index: number) => {
    const floorPlanId = floorPlans[index]?.id;
    if (!floorPlanId) return;

    setFloorPlans(prev => prev.filter((_, i) => i !== index));
    
    // Use the createCanvasAction helper to ensure timestamp is added
    setHistory(prev => [
      ...prev, 
      createCanvasAction({
        type: 'delete_floor_plan',
        floorPlanId
      }) as DeleteFloorPlanAction
    ]);

    // Update current floor plan index if needed
    if (currentFloorPlanIndex >= index) {
      setCurrentFloorPlanIndex(prev => Math.max(0, prev - 1));
    }
  }, [floorPlans, currentFloorPlanIndex]);

  // Custom converter function for compatible floor plans
  const getCompatibleFloorPlans = useCallback(() => {
    // Create new objects with all required properties to ensure compatibility
    return floorPlans.map(plan => ({
      ...plan,
      // Ensure these properties exist
      createdAt: plan.createdAt || new Date().toISOString(),
      updatedAt: plan.updatedAt || new Date().toISOString(),
      data: plan.data || {},
      userId: plan.userId || ''
    }));
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
