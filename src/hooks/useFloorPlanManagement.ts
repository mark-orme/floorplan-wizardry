
/**
 * Custom hook for managing floor plans (create, select, etc.)
 * @module useFloorPlanManagement
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { FloorPlan, PaperSize } from "@/types/floorPlanTypes";

interface UseFloorPlanManagementProps {
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
}

/**
 * Hook that handles floor plan management operations
 */
export const useFloorPlanManagement = ({
  floorPlans,
  currentFloor,
  setFloorPlans
}: UseFloorPlanManagementProps) => {
  /**
   * Add a new floor plan
   * Currently commented out as we're using a single floor for all plans
   */
  const handleAddFloor = useCallback(() => {
    // Just a placeholder function that doesn't do anything
    // We're drawing all floors on one page
    
    // Commented out toast message to avoid showing notifications
    // toast.info("All floors are drawn on a single page for better visualization");
  }, []);

  /**
   * Select a floor plan
   */
  const handleSelectFloor = useCallback((index: number) => {
    // Prevent spamming toast notifications
    if (index !== currentFloor) {
      toast.info(`Switched to ${floorPlans[index]?.label || 'Unknown floor'}`);
    }
  }, [floorPlans, currentFloor]);

  return {
    handleAddFloor,
    handleSelectFloor
  };
};

