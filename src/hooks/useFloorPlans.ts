
/**
 * Main hook for floor plan operations
 * Combines specialized floor plan hooks for various functionalities
 * @module useFloorPlans
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

// Import the unified FloorPlan type from the centralized location
import { FloorPlan } from "@/types/floorPlanTypes";

// Import specialized floor plan hooks
import { useFloorPlanDrawing } from "./floor-plan";
import { useFloorPlanGIA } from "./useFloorPlanGIA";
import { useFloorPlanManagement } from "./useFloorPlanManagement";
import { useFloorPlanStorage } from "./useFloorPlanStorage";

interface UseFloorPlansProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  isLoading: boolean;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  clearDrawings: () => void;
  createGrid: (canvas: FabricCanvas) => any[];
}

export const useFloorPlans = ({
  fabricCanvasRef,
  gridLayerRef,
  floorPlans,
  currentFloor,
  isLoading,
  setGia,
  setFloorPlans,
  clearDrawings,
  createGrid
}: UseFloorPlansProps) => {
  const floorChangeInProgressRef = useRef(false);
  
  // Initialize floor plan drawing functionality
  const { drawFloorPlan } = useFloorPlanDrawing({
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    floorChangeInProgressRef
  });
  
  // Initialize GIA calculation
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });
  
  // Initialize floor plan management (add, select)
  const { handleAddFloor, handleSelectFloor } = useFloorPlanManagement({
    floorPlans,
    currentFloor,
    setFloorPlans
  });
  
  // Initialize floor plan storage
  const { loadData } = useFloorPlanStorage({
    floorPlans,
    isLoading
  });

  // Update canvas when floor changes with debouncing
  useEffect(() => {
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    
    // Skip if a floor change is already in progress
    if (floorChangeInProgressRef.current) return;
    
    console.log("Floor changed, updating canvas");
    
    // Use a more efficient approach for floor changes
    const floorChangeHandler = () => {
      clearDrawings();
      drawFloorPlan(currentFloor, floorPlans);
      
      // OPTIMIZATION: Delay GIA calculation after drawing is complete
      setTimeout(recalculateGIA, 200);
    };
    
    // Execute with a short delay to avoid rapid consecutive calls
    setTimeout(floorChangeHandler, 50);
    
  }, [currentFloor, floorPlans, isLoading, fabricCanvasRef, clearDrawings, drawFloorPlan, recalculateGIA]);

  return {
    drawFloorPlan: useCallback((floorIndex = currentFloor) => drawFloorPlan(floorIndex, floorPlans), [currentFloor, floorPlans, drawFloorPlan]),
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData
  };
};
