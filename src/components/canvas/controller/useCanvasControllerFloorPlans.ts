
/**
 * Hook for managing floor plans in the canvas controller
 * @module useCanvasControllerFloorPlans
 */
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorSelection } from "@/hooks/useFloorSelection";

/**
 * Props interface for useCanvasControllerFloorPlans hook
 * @interface UseCanvasControllerFloorPlansProps
 */
interface UseCanvasControllerFloorPlansProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Index of current floor */
  currentFloor: number;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Function to set the GIA (Gross Internal Area) */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set the current floor */
  setCurrentFloor: React.Dispatch<React.SetStateAction<number>>;
  /** Function to clear drawings from canvas */
  clearDrawings: () => void;
  /** Function to create grid objects */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Hook that manages floor plan operations in the canvas controller
 * @param {UseCanvasControllerFloorPlansProps} props - Hook properties
 * @returns Floor plan functions and handlers
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
    createGrid
  } = props;

  // Floor plans management
  const {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData
  } = useFloorPlans({
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    clearDrawings,
    createGrid
  });

  // Floor selection
  const { handleFloorSelect } = useFloorSelection({
    currentFloor,
    setCurrentFloor,
    handleSelectFloor
  });

  return {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleFloorSelect,
    loadData
  };
};
