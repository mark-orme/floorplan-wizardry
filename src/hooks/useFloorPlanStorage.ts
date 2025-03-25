
/**
 * Custom hook for floor plan data storage and auto-saving
 * Combines local storage with Supabase cloud storage
 * @module useFloorPlanStorage
 */
import { useCallback } from "react";
import { useSyncedFloorPlans } from "./useSyncedFloorPlans";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Hook that handles the storage and auto-saving of floor plans
 * Now with cross-device synchronization and cloud storage
 */
export const useFloorPlanStorage = () => {
  // Use the synchronized floor plans system with Supabase integration
  const { floorPlans, setFloorPlans, isLoading, loadData } = useSyncedFloorPlans();

  return { 
    floorPlans,
    setFloorPlans,
    isLoading,
    loadData
  };
};
