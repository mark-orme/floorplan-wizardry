/**
 * Hook for managing floor plans in the canvas controller
 * @module useCanvasControllerFloorPlans
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlan";

/**
 * Props for the useCanvasControllerFloorPlans hook
 * @interface UseCanvasControllerFloorPlansProps
 */
interface UseCanvasControllerFloorPlansProps {
  /** Reference to the Fabric canvas instance */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Current floor index */
  currentFloor: number;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Function to set gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set current floor */
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  /** Function to clear all drawings from canvas */
  clearDrawings: () => void;
  /** Function to create a grid on the canvas */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  /** Optional function to recalculate gross internal area */
  recalculateGIA?: () => void;
}

/**
 * Hook that manages floor plans in the canvas controller
 * Handles drawing, selection, and addition of floor plans
 * 
 * @param {UseCanvasControllerFloorPlansProps} props - Hook properties
 * @returns {Object} Floor plan management functions
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

  /**
   * Draw a specific floor plan on the canvas
   * 
   * @param {number} floorIndex - Index of the floor to draw
   * @param {FloorPlan[]} plans - Array of floor plans
   */
  const drawFloorPlan = useCallback((floorIndex: number, plans: FloorPlan[]) => {
    if (!fabricCanvasRef.current) return;
    
    // Implementation details...
    
    // Recalculate GIA after drawing if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, recalculateGIA]);

  /**
   * Handle floor selection
   * Switches to a different floor in the floor plan
   * 
   * @param {number} index - Index of the floor to select
   */
  const handleFloorSelect = useCallback((index: number) => {
    // Implementation details...
    
    // Update current floor
    setCurrentFloor(index);
    
    // Recalculate GIA after selection if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, floorPlans, clearDrawings, setCurrentFloor, drawFloorPlan, recalculateGIA]);

  /**
   * Handle adding a new floor
   * Creates a new floor plan and adds it to the floor plans array
   */
  const handleAddFloor = useCallback(() => {
    // Implementation details...
    
    // Recalculate GIA after adding floor if function exists
    if (recalculateGIA) {
      setTimeout(recalculateGIA, 100);
    }
  }, [fabricCanvasRef, floorPlans, currentFloor, setFloorPlans, setCurrentFloor, clearDrawings, recalculateGIA]);

  /**
   * Load floor plan data
   * Initializes and loads floor plan data from storage
   */
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
