import { useCallback } from 'react';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { FloorPlan } from '@/types/floorPlanTypes';

interface UseFloorPlanOperationsProps {
  canvas: ExtendedFabricCanvas | null;
  floorPlans: FloorPlan[];
  currentFloorIndex: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
}

export const useFloorPlanOperations = ({
  canvas,
  floorPlans,
  currentFloorIndex,
  setFloorPlans
}: UseFloorPlanOperationsProps) => {
  const saveFloorPlan = useCallback(() => {
    const floorPlan = floorPlans[currentFloorIndex];

    if (canvas && floorPlan) {
      floorPlan.data = canvas.toJSON();
    }
    
    setFloorPlans(prevFloorPlans => {
      const updatedFloorPlans = [...prevFloorPlans];
      updatedFloorPlans[currentFloorIndex] = floorPlan;
      return updatedFloorPlans;
    });
  }, [canvas, floorPlans, currentFloorIndex, setFloorPlans]);

  return { saveFloorPlan };
};
