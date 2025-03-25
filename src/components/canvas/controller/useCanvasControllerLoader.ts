
/**
 * Hook for loading floor plan data in the canvas controller
 * @module useCanvasControllerLoader
 */
import { useEffect } from "react";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { FloorPlan } from "@/types/floorPlanTypes";

interface UseCanvasControllerLoaderProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  loadData: () => void;
}

/**
 * Hook that handles loading floor plan data
 * @returns Data loading functions
 */
export const useCanvasControllerLoader = (props: UseCanvasControllerLoaderProps) => {
  const {
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  } = props;

  // Floor plan data loading
  const { 
    loadFloorPlansData 
  } = useFloorPlanLoader({
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  });

  // Load floor plans data
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  return {
    loadFloorPlansData
  };
};
