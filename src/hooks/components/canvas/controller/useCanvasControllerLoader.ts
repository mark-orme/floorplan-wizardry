
/**
 * Hook for loading floor plan data in the canvas controller
 * Handles data loading operations with appropriate state management
 * @module useCanvasControllerLoader
 */
import { useEffect } from "react";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Props for the useCanvasControllerLoader hook
 * @interface UseCanvasControllerLoaderProps
 */
interface UseCanvasControllerLoaderProps {
  /** State setter for loading status */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /** State setter for floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  /** Function to load data from storage */
  loadData: () => Promise<unknown>;
}

/**
 * Return type for the useCanvasControllerLoader hook
 * @interface UseCanvasControllerLoaderResult
 */
interface UseCanvasControllerLoaderResult {
  /** Function to load floor plans data */
  loadFloorPlansData: () => Promise<void>;
}

/**
 * Hook that handles loading floor plan data
 * Manages loading state and error handling
 * 
 * @param {UseCanvasControllerLoaderProps} props - Hook properties 
 * @returns {UseCanvasControllerLoaderResult} Data loading functions
 * 
 * @example
 * const { loadFloorPlansData } = useCanvasControllerLoader({
 *   setIsLoading,
 *   setFloorPlans,
 *   setHasError,
 *   setErrorMessage,
 *   loadData
 * });
 * 
 * // Load data when component mounts
 * useEffect(() => {
 *   loadFloorPlansData();
 * }, []);
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
   * Ensures consistent return type for loadFloorPlansData
   * 
   * @returns {Promise<void>} Promise that resolves when data is loaded
   */
  const loadFloorPlansData = async (): Promise<void> => {
    await originalLoadFloorPlansData();
    // Return void explicitly
    return;
  };

  // Load floor plans data on mount
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  return {
    loadFloorPlansData
  };
};
