
/**
 * Hook for floor plan operations
 * Handles floor-related operations
 */
import { useCallback } from "react";
import { FloorPlan, PaperSize } from "@/types/floorPlanTypes";
import { toast } from "sonner";

/**
 * Props for useFloorPlanOperations hook
 */
interface UseFloorPlanOperationsProps {
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook that manages floor plan operations
 */
export const useFloorPlanOperations = ({
  floorPlans,
  currentFloor,
  setFloorPlans,
  setGia
}: UseFloorPlanOperationsProps) => {
  /**
   * Handle floor selection
   */
  const handleFloorSelect = useCallback((floorIndex: number): void => {
    if (floorIndex >= 0 && floorIndex < floorPlans.length) {
      console.info(`Floor selected: ${floorPlans[floorIndex].name}`);
      toast.success(`${floorPlans[floorIndex].name} selected`);
      // Implement actual floor selection logic
    }
  }, [floorPlans]);
  
  /**
   * Add a new floor
   */
  const handleAddFloor = useCallback((): void => {
    const newFloorName = `Floor ${floorPlans.length + 1}`;
    
    // Create a new floor plan
    const newFloor: FloorPlan = {
      id: `floor-${Date.now()}`,
      name: newFloorName,
      label: newFloorName,
      data: {},
      userId: '',
      gia: 0,
      walls: [],
      rooms: [],
      strokes: [],
      canvasData: null,
      canvasJson: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      level: floorPlans.length,
      index: floorPlans.length,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: PaperSize.A4,
        level: floorPlans.length
      }
    };
    
    // Add it to the list
    setFloorPlans(prevFloorPlans => [...prevFloorPlans, newFloor]);
    toast.success(`New floor added: ${newFloorName}`);
  }, [floorPlans, setFloorPlans]);
  
  return {
    handleFloorSelect,
    handleAddFloor
  };
};
