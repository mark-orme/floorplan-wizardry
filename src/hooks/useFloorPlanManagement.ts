
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
   */
  const handleAddFloor = useCallback(() => {
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
