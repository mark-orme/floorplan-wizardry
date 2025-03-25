
/**
 * Custom hook for floor plan storage operations
 * @module useFloorPlanStorage
 */
import { useCallback } from "react";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Hook for managing floor plan data storage
 * @returns {Object} Floor plan storage functions
 */
export const useFloorPlanStorage = () => {
  /**
   * Load floor plan data from storage
   * @returns {Promise<FloorPlan[]>} Loaded floor plans or empty array
   */
  const loadData = useCallback(async (): Promise<FloorPlan[]> => {
    try {
      // Attempt to load from localStorage
      const storedData = localStorage.getItem('floorPlans');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Loaded floor plans from storage:", parsedData);
        return parsedData;
      }
      
      console.log("No stored floor plans found");
      return [];
    } catch (error) {
      console.error("Error loading floor plans:", error);
      return [];
    }
  }, []);

  /**
   * Save floor plan data to storage
   * @param {FloorPlan[]} floorPlans - Floor plans to save
   * @returns {Promise<boolean>} Success state
   */
  const saveData = useCallback(async (floorPlans: FloorPlan[]): Promise<boolean> => {
    try {
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      console.log("Floor plans saved to storage");
      return true;
    } catch (error) {
      console.error("Error saving floor plans:", error);
      return false;
    }
  }, []);

  return {
    loadData,
    saveData
  };
};
