/**
 * Hook for syncing floor plans between canvas and state
 * @module hooks/useSyncedFloorPlans
 */
import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import { toast } from "sonner";

/**
 * Hook to synchronize floor plans with the canvas
 * 
 * @returns Functions to manage floor plan synchronization
 */
export const useSyncedFloorPlans = () => {
  // Add state for floor plans
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  
  // Sync effect for loading initial floor plans
  useEffect(() => {
    console.log("Initializing synced floor plans");
    
    // Load floor plans from storage if available
    loadData();
  }, []);
  
  /**
   * Load floor plans from storage
   * @returns Promise that resolves to the loaded floor plans
   */
  const loadData = useCallback(async (): Promise<FloorPlan[]> => {
    try {
      // Try to load from localStorage first
      const storedData = localStorage.getItem('floorPlans');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Loaded floor plans from storage:", parsedData);
        setFloorPlans(parsedData);
        return parsedData;
      }
      
      console.log("No stored floor plans found");
      return [];
    } catch (error) {
      console.error("Error loading floor plans:", error);
      toast.error("Failed to load floor plans");
      return [];
    }
  }, []);
  
  /**
   * Save floor plans to storage
   * @param updatedFloorPlans Floor plans to save
   * @returns Promise that resolves to success status
   */
  const saveData = useCallback(async (updatedFloorPlans: FloorPlan[]): Promise<boolean> => {
    try {
      localStorage.setItem('floorPlans', JSON.stringify(updatedFloorPlans));
      setFloorPlans(updatedFloorPlans);
      console.log("Floor plans saved to storage");
      return true;
    } catch (error) {
      console.error("Error saving floor plans:", error);
      toast.error("Failed to save floor plans");
      return false;
    }
  }, []);
  
  return {
    // Include the state and functions that PropertyDetail.tsx expects
    floorPlans,
    setFloorPlans,
    loadData,
    // Keep the original functions
    syncFloorPlans: (canvas: FabricCanvas, floorPlans: FloorPlan[]) => {
      console.log("Syncing floor plans with canvas:", floorPlans.length);
      // Implementation would sync floor plans with canvas
    },
    loadFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => {
      console.log("Loading floor plan to canvas:", floorPlan.id);
      // Implementation would load a floor plan to canvas
    },
    saveFloorPlan: (canvas: FabricCanvas): FloorPlan | null => {
      console.log("Saving canvas state to floor plan");
      // Implementation would save canvas state to floor plan
      return null;
    },
    calculateGIA: (floorPlans: FloorPlan[]): number => {
      // Implementation would calculate GIA from floor plans
      return 0;
    }
  };
};
