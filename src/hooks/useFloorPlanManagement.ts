
/**
 * Custom hook for managing floor plans (create, select, etc.)
 * Provides functions for floor plan management operations
 * @module useFloorPlanManagement
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { FloorPlan, PaperSize } from "@/types/floorPlanTypes";

/**
 * Props for the useFloorPlanManagement hook
 * @interface UseFloorPlanManagementProps
 */
interface UseFloorPlanManagementProps {
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Index of the currently selected floor */
  currentFloor: number;
  /** State setter for floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
}

/**
 * Hook that handles floor plan management operations
 * Provides functions for adding and selecting floor plans
 * 
 * @param {UseFloorPlanManagementProps} props - Hook properties
 * @returns {Object} Floor plan management functions
 * 
 * @example
 * const { handleAddFloor, handleSelectFloor } = useFloorPlanManagement({
 *   floorPlans,
 *   currentFloor,
 *   setFloorPlans
 * });
 */
export const useFloorPlanManagement = ({
  floorPlans,
  currentFloor,
  setFloorPlans
}: UseFloorPlanManagementProps) => {
  /**
   * Add a new floor plan
   * Currently commented out as we're using a single floor for all plans
   * 
   * @returns {void}
   */
  const handleAddFloor = useCallback(() => {
    // Just a placeholder function that doesn't do anything
    // We're drawing all floors on one page
    
    // Commented out toast message to avoid showing notifications
    // toast.info("All floors are drawn on a single page for better visualization");
  }, []);

  /**
   * Select a floor plan
   * Changes the active floor and shows a notification
   * 
   * @param {number} index - Index of the floor to select
   * @returns {void}
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
