
/**
 * Hook for managing floor plans in the canvas controller
 * @module useCanvasControllerFloorPlans
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";

interface UseCanvasControllerFloorPlansProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  isLoading: boolean;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  clearDrawings: () => void;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  recalculateGIA?: () => void;
}

/**
 * Hook that manages floor plans in the canvas controller
 * @returns Floor plan management functions
 */
export const useCanvasControllerFloorPlans = (props: UseCanvasControllerFloorPlansProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    setCurrentFloor,
    clearDrawings,
    createGrid,
    recalculateGIA
  } = props;

  // Draw floor plan
  const drawFloorPlan = useCallback((floorIndex: number, plans: FloorPlan[]) => {
    if (!fabricCanvasRef.current) return;
    
    // Implementation details...
    
    // Recalculate GIA after drawing if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, recalculateGIA]);

  // Handle floor selection
  const handleFloorSelect = useCallback((index: number) => {
    // Implementation details...
    
    // Update current floor
    setCurrentFloor(index);
    
    // Recalculate GIA after selection if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, floorPlans, clearDrawings, setCurrentFloor, drawFloorPlan, recalculateGIA]);

  // Handle adding a new floor
  const handleAddFloor = useCallback(() => {
    // Implementation details...
    
    // Recalculate GIA after adding floor if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, floorPlans, currentFloor, setFloorPlans, setCurrentFloor, clearDrawings, recalculateGIA]);

  // Load data
  const loadData = useCallback(() => {
    // Implementation details...
    
    // Recalculate GIA after loading data if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, setFloorPlans, setGia, recalculateGIA]);

  return {
    drawFloorPlan,
    handleAddFloor,
    handleFloorSelect,
    loadData
  };
};
