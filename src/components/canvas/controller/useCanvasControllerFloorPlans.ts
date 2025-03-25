
/**
 * Hook for managing floor plans in the canvas controller
 * @module useCanvasControllerFloorPlans
 */
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorSelection } from "@/hooks/useFloorSelection";

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
}

/**
 * Hook that manages floor plan operations in the canvas controller
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
