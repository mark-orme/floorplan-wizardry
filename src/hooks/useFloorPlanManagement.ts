
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
    // Commented out as requested - drawing all floors on one page
    /*
    setFloorPlans(prev => [
      ...prev, 
      { 
        strokes: [], 
        label: `Floor ${prev.length + 1}`,
        paperSize: "infinite" as PaperSize,
        id: `floor-${Date.now()}`,
        name: `Floor ${prev.length + 1}`,
        gia: 0
      }
    ]);
    toast.success(`New floor plan added: Floor ${floorPlans.length + 1}`);
    */
    
    // Instead show a toast message explaining the current approach
    toast.info("All floors are drawn on a single page for better visualization");
  }, [floorPlans.length, setFloorPlans]);

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
