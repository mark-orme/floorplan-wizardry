
/**
 * Custom hook for floor plan data storage and auto-saving
 * @module useFloorPlanStorage
 */
import { useCallback } from "react";
import { useSyncedFloorPlans } from "./useSyncedFloorPlans";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Hook that handles the storage and auto-saving of floor plans
 * Now with cross-device synchronization
 */
export const useFloorPlanStorage = () => {
  // Use the synchronized floor plans system
  const { floorPlans, setFloorPlans, isLoading, loadData } = useSyncedFloorPlans();

  return { 
    floorPlans,
    setFloorPlans,
    isLoading,
    loadData
  };
};
