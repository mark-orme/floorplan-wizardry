
/**
 * Main hook for floor plan operations
 * Combines specialized floor plan hooks for various functionalities
 * @module useFloorPlans
 */
import { useCallback, useEffect, useMemo, useRef } from "react";
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
  
  // Initialize GIA calculation
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });
  
  // Memoize hook dependencies to prevent circular dependencies
  const hookDeps = useMemo(() => ({
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    floorChangeInProgressRef,
    recalculateGIA  // Pass recalculateGIA to the drawing hook
  }), [fabricCanvasRef, gridLayerRef, createGrid, recalculateGIA]);
  
  // Initialize floor plan drawing functionality
  const { drawFloorPlan } = useFloorPlanDrawing();
  
  // Initialize floor plan management (add, select)
  const { handleAddFloor, handleSelectFloor } = useFloorPlanManagement({
    floorPlans,
    currentFloor,
    setFloorPlans
  });
  
  // Initialize floor plan storage - Get the loadData function that returns a promise
  const { loadData, saveData, lastSaved, isLoggedIn, isSaving } = useFloorPlanStorage();

  // Draw the floor plan with the proper canvas
  const drawFloorPlanWithCanvas = useCallback((floorIndex: number, plans: FloorPlan[]) => {
    if (!fabricCanvasRef.current) return;
    if (plans.length === 0 || floorIndex >= plans.length) return;
    
    const floorPlan = plans[floorIndex];
    drawFloorPlan(fabricCanvasRef.current, floorPlan);
    
    // Recalculate GIA after drawing
    setTimeout(recalculateGIA, 200);
  }, [fabricCanvasRef, drawFloorPlan, recalculateGIA]);

  // Update canvas when floor changes with debouncing - use stable version of dependencies
  useEffect(() => {
    // Skip if no canvas, if loading, or if no floorplans
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    
    // Skip if a floor change is already in progress
    if (floorChangeInProgressRef.current) return;
    
    console.log("Floor changed, updating canvas");
    
    // Use a more efficient approach for floor changes
    const floorChangeHandler = () => {
      clearDrawings();
      drawFloorPlanWithCanvas(currentFloor, floorPlans);
      
      // OPTIMIZATION: Delay GIA calculation after drawing is complete
      setTimeout(recalculateGIA, 200);
    };
    
    // Execute with a short delay to avoid rapid consecutive calls
    setTimeout(floorChangeHandler, 50);
    
  }, [
    currentFloor, 
    floorPlans.length, // Only depend on the length of floorPlans to reduce rerenders
    isLoading,
    fabricCanvasRef,
    clearDrawings,
    drawFloorPlanWithCanvas,
    recalculateGIA
  ]);

  return {
    drawFloorPlan: useCallback((floorIndex = currentFloor) => 
      drawFloorPlanWithCanvas(floorIndex, floorPlans), 
      [currentFloor, floorPlans, drawFloorPlanWithCanvas]
    ),
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData,
    saveData,
    lastSaved,
    isLoggedIn,
    isSaving
  };
};
