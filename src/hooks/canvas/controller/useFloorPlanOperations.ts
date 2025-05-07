
import { useCallback } from 'react';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { FloorPlan } from '@/types/fabric-unified';

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
    // Add safety check for array bounds
    if (currentFloorIndex < 0 || currentFloorIndex >= floorPlans.length) return;
    
    const floorPlan = floorPlans[currentFloorIndex];
    
    // Safety check to ensure floorPlan exists
    if (!floorPlan) return;

    const updatedFloorPlan: FloorPlan = { ...floorPlan }; // Create a copy for type safety
    
    if (canvas) {
      updatedFloorPlan.data = canvas.toJSON();
    }
    
    setFloorPlans(prevFloorPlans => {
      const updatedFloorPlans = [...prevFloorPlans];
      // Check again if index is valid
      if (currentFloorIndex >= 0 && currentFloorIndex < updatedFloorPlans.length) {
        updatedFloorPlans[currentFloorIndex] = updatedFloorPlan;
      }
      return updatedFloorPlans;
    });
  }, [canvas, floorPlans, currentFloorIndex, setFloorPlans]);

  return { saveFloorPlan };
};
