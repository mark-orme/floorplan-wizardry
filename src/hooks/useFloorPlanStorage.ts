
/**
 * Custom hook for floor plan data storage and auto-saving
 * @module useFloorPlanStorage
 */
import { useCallback, useEffect, useRef } from "react";
import { FloorPlan, loadFloorPlans, saveFloorPlans } from "@/utils/drawing";

interface UseFloorPlanStorageProps {
  floorPlans: FloorPlan[];
  isLoading: boolean;
}

/**
 * Hook that handles the storage and auto-saving of floor plans
 */
export const useFloorPlanStorage = ({
  floorPlans,
  isLoading
}: UseFloorPlanStorageProps) => {
  const saveTimeoutRef = useRef<number | null>(null);
  
  /**
   * Auto-save floor plans when they change with debounce
   */
  useEffect(() => {
    if (isLoading || floorPlans.length === 0) return;
    
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    
    // OPTIMIZATION: Increased debounce timeout for better performance
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await saveFloorPlans(floorPlans);
        saveTimeoutRef.current = null;
      } catch (error) {
        console.error("Error saving floor plans:", error);
      }
    }, 2000);
    
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [floorPlans, isLoading]);

  /**
   * Load floor plans from storage
   */
  const loadData = useCallback(async () => {
    return await loadFloorPlans();
  }, []);

  return { loadData };
};
