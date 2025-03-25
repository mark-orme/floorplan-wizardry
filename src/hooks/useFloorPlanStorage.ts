
/**
 * Custom hook for floor plan storage operations
 * @module useFloorPlanStorage
 */
import { useCallback, useState, useEffect } from "react";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for managing floor plan data storage
 * @returns {Object} Floor plan storage functions and state
 */
export const useFloorPlanStorage = () => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;

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
      setIsSaving(true);
      localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      console.log("Floor plans saved to storage");
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error("Error saving floor plans:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Update lastSaved from localStorage on mount
  useEffect(() => {
    const timestamp = localStorage.getItem('floorPlansLastSaved');
    if (timestamp) {
      try {
        setLastSaved(new Date(JSON.parse(timestamp)));
      } catch (e) {
        console.error("Error parsing last saved timestamp:", e);
      }
    }
  }, []);

  return {
    loadData,
    saveData,
    lastSaved,
    isLoggedIn,
    isSaving
  };
};
