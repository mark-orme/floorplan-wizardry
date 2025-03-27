
/**
 * Hook for loading floor plan data in the canvas controller
 * @module useCanvasControllerLoader
 */
import { useEffect } from "react";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Props for the useCanvasControllerLoader hook
 * 
 * @interface UseCanvasControllerLoaderProps
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsLoading - Function to update loading state
 * @property {React.Dispatch<React.SetStateAction<FloorPlan[]>>} setFloorPlans - Function to update floor plans state
 * @property {(value: boolean) => void} setHasError - Function to update error state
 * @property {(value: string) => void} setErrorMessage - Function to update error message
 * @property {() => Promise<unknown>} loadData - Function to load floor plan data
 */
interface UseCanvasControllerLoaderProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  loadData: () => Promise<unknown>;
}

/**
 * Result of the useCanvasControllerLoader hook
 * 
 * @interface UseCanvasControllerLoaderResult
 * @property {() => Promise<void>} loadFloorPlansData - Function to load floor plan data
 */
interface UseCanvasControllerLoaderResult {
  loadFloorPlansData: () => Promise<void>;
}

/**
 * Hook that handles loading floor plan data
 * Initializes data loading and provides reload functionality
 * 
 * @param {UseCanvasControllerLoaderProps} props - Hook properties
 * @returns {UseCanvasControllerLoaderResult} Data loading functions
 */
export const useCanvasControllerLoader = (props: UseCanvasControllerLoaderProps): UseCanvasControllerLoaderResult => {
  const {
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  } = props;

  // Floor plan data loading
  const { 
    loadFloorPlansData: originalLoadFloorPlansData
  } = useFloorPlanLoader({
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  });

  /**
   * Wrapper function to convert Promise<boolean> to Promise<void>
   * Loads floor plan data and ensures consistent return type
   * 
   * @returns {Promise<void>} Promise that resolves when data is loaded
   */
  const loadFloorPlansData = async (): Promise<void> => {
    await originalLoadFloorPlansData();
    // Return void explicitly
    return;
  };

  // Load floor plans data
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  return {
    loadFloorPlansData
  };
};
