
/**
 * Custom hook for loading floor plan data
 * Handles loading, error handling, and default floor plan creation
 * @module useFloorPlanLoader
 */
import { useCallback } from "react";
import { FloorPlan, PaperSize } from "@/utils/drawing";

/**
 * Interface for useFloorPlanLoader hook props
 * @interface UseFloorPlanLoaderProps
 */
interface UseFloorPlanLoaderProps {
  /** Function to set loading state */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
  /** Function to set floor plans data */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  
  /** Function to load data from storage */
  loadData: () => Promise<any>;
}

/**
 * Hook for loading floor plan data
 * Provides functionality to load floor plans from storage or create defaults
 * Includes error handling and loading state management
 * 
 * @param {UseFloorPlanLoaderProps} props - Hook properties
 * @returns {Object} Floor plan loading utilities
 */
export const useFloorPlanLoader = ({
  setIsLoading,
  setFloorPlans,
  setHasError,
  setErrorMessage,
  loadData
}: UseFloorPlanLoaderProps) => {
  
  /**
   * Load floor plans data
   * Attempts to load existing floor plans from storage
   * Creates a default floor plan if none exist
   * Handles errors and loading states
   * 
   * @returns {Promise<boolean>} Success state of the loading operation
   */
  const loadFloorPlansData = useCallback(async () => {
    try {
      console.log("Loading floor plans...");
      setIsLoading(true);
      const plans = await loadData();
      
      // If plans exist, load them, otherwise create a default
      if (plans && plans.length > 0) {
        setFloorPlans(plans);
        console.log("Floor plans loaded:", plans);
      } else {
        // Create a default floor plan with a properly typed paperSize
        const defaultPlan = [{
          strokes: [],
          label: "Ground Floor",
          paperSize: "infinite" as PaperSize
        }];
        setFloorPlans(defaultPlan);
        console.log("Created default floor plan");
      }
      
      setIsLoading(false);
      setHasError(false);
      return true;
    } catch (error) {
      console.error("Error loading floor plans:", error);
      setHasError(true);
      setErrorMessage("Failed to load floor plans");
      setIsLoading(false);
      return false;
    }
  }, [loadData, setFloorPlans, setHasError, setErrorMessage, setIsLoading]);

  return {
    loadFloorPlansData
  };
};

