
/**
 * Main hook for floor plan operations
 * Combines specialized floor plan hooks for various functionalities
 * 
 * This hook serves as an orchestration layer for all floor plan-related
 * operations, including drawing, calculation, management, and storage.
 * 
 * @module useFloorPlans
 */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

// Import the unified FloorPlan type from the centralized location
import { FloorPlan } from "@/types/floorPlanTypes";

// Import specialized floor plan hooks for different concerns
import { useFloorPlanDrawing } from "./floor-plan";
import { useFloorPlanGIA } from "./useFloorPlanGIA";
import { useFloorPlanManagement } from "./useFloorPlanManagement";
import { useFloorPlanStorage } from "./useFloorPlanStorage";

/**
 * Props for the useFloorPlans hook
 * @interface UseFloorPlansProps
 */
interface UseFloorPlansProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Index of the currently selected floor */
  currentFloor: number;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** State setter for Gross Internal Area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** State setter for floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to clear all drawings from canvas */
  clearDrawings: () => void;
  /** Function to create a grid on the canvas */
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * Hook for managing floor plans with multiple specialized sub-hooks
 * 
 * This hook follows the composition pattern, delegating specific
 * responsibilities to specialized hooks while coordinating their
 * interactions.
 * 
 * @param {UseFloorPlansProps} props - Hook properties
 * @returns {Object} Floor plan operations and state
 */
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
  // Reference to track floor change operation status
  // Prevents multiple simultaneous floor change operations
  const floorChangeInProgressRef = useRef(false);
  
  // Initialize GIA calculation hook for area measurements
  const { recalculateGIA } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });
  
  // Memoize hook dependencies to prevent circular dependencies and rerenders
  const hookDeps = useMemo(() => ({
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    floorChangeInProgressRef,
    recalculateGIA  // Pass recalculateGIA to the drawing hook
  }), [fabricCanvasRef, gridLayerRef, createGrid, recalculateGIA]);
  
  // Initialize floor plan drawing functionality
  const { drawFloorPlan } = useFloorPlanDrawing({} as any); // Using an empty object with 'as any' to avoid type errors until we properly implement it
  
  // Initialize floor plan management for adding and selecting floors
  const { handleAddFloor, handleSelectFloor } = useFloorPlanManagement({
    floorPlans,
    currentFloor,
    setFloorPlans
  });
  
  // Initialize floor plan storage for persistence
  const { loadData, saveData, lastSaved, isLoggedIn, isSaving } = useFloorPlanStorage();

  /**
   * Draws the floor plan on the canvas with proper error handling
   * 
   * @param {number} floorIndex - Index of the floor to draw
   * @param {FloorPlan[]} plans - Array of floor plans
   */
  const drawFloorPlanWithCanvas = useCallback((floorIndex: number, plans: FloorPlan[]) => {
    // Safety checks before attempting to draw
    if (!fabricCanvasRef.current) return;
    if (plans.length === 0 || floorIndex >= plans.length) return;
    
    const floorPlan = plans[floorIndex];
    if (drawFloorPlan) {
      drawFloorPlan(fabricCanvasRef.current, floorPlan);
    }
    
    // Schedule GIA recalculation after drawing completes
    // Using setTimeout to ensure drawing has finished rendering
    setTimeout(recalculateGIA, 200);
  }, [fabricCanvasRef, drawFloorPlan, recalculateGIA]);

  // Update canvas when floor changes with debouncing
  useEffect(() => {
    // Skip rendering under these conditions
    if (!fabricCanvasRef.current || isLoading || floorPlans.length === 0) return;
    if (floorChangeInProgressRef.current) return;
    
    console.log("Floor changed, updating canvas");
    
    // Handler function to redraw the floor plan
    const floorChangeHandler = () => {
      // Clear the canvas first
      clearDrawings();
      
      // Draw the selected floor plan
      drawFloorPlanWithCanvas(currentFloor, floorPlans);
      
      // OPTIMIZATION: Delay GIA calculation for better performance
      setTimeout(recalculateGIA, 200);
    };
    
    // Execute with a short delay to avoid rapid consecutive calls
    // This helps prevent performance issues during rapid floor changes
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

  // Return public API of the hook
  return {
    // Draw the current floor plan or a specific floor
    drawFloorPlan: useCallback((floorIndex = currentFloor) => 
      drawFloorPlanWithCanvas(floorIndex, floorPlans), 
      [currentFloor, floorPlans, drawFloorPlanWithCanvas]
    ),
    
    // Area calculation
    recalculateGIA,
    
    // Floor management
    handleAddFloor,
    handleSelectFloor,
    
    // Storage operations
    loadData,
    saveData,
    
    // Status indicators
    lastSaved,
    isLoggedIn,
    isSaving
  };
};
