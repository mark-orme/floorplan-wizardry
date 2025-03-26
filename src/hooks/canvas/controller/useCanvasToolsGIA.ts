
/**
 * Hook for handling GIA (Gross Internal Area) calculations in the canvas controller
 * @module canvas/controller/useCanvasToolsGIA
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";
import { useFloorPlanGIA } from "@/hooks/useFloorPlanGIA";
import logger from "@/utils/logger";

interface UseCanvasToolsGIAProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Function to set the gross internal area */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Function to recalculate GIA */
  recalculateGIA: () => void;
}

/**
 * Hook that manages GIA calculations and updates
 * 
 * @param {UseCanvasToolsGIAProps} props - Hook properties
 * @returns Tool functions related to GIA calculations
 */
export const useCanvasToolsGIA = ({
  fabricCanvasRef,
  setGia,
  recalculateGIA
}: UseCanvasToolsGIAProps) => {
  
  // Add canvas event listeners to trigger GIA calculation when objects change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Calculate GIA on object modifications, additions or removals
    const handleObjectChange = () => {
      recalculateGIA();
    };
    
    canvas.on('object:added', handleObjectChange);
    canvas.on('object:removed', handleObjectChange);
    canvas.on('object:modified', handleObjectChange);
    
    // Initial calculation
    recalculateGIA();
    
    return () => {
      canvas.off('object:added', handleObjectChange);
      canvas.off('object:removed', handleObjectChange);
      canvas.off('object:modified', handleObjectChange);
    };
  }, [fabricCanvasRef, recalculateGIA]);

  return {
    recalculateGIA
  };
};
