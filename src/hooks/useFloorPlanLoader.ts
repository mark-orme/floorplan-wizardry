
/**
 * Custom hook for loading floor plan data
 * @module useFloorPlanLoader
 */
import { useCallback } from "react";
import { FloorPlan, PaperSize } from "@/utils/drawing";
import { toast } from "sonner";

interface UseFloorPlanLoaderProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  loadData: () => Promise<any>;
}

/**
 * Hook for loading floor plan data
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
   */
  const loadFloorPlansData = useCallback(async () => {
    try {
      console.log("Loading floor plans data...");
      setIsLoading(true);
      setHasError(false); // Reset error state before loading
      
      const plans = await loadData();
      
      // If plans exist, load them, otherwise create a default
      if (plans && plans.length > 0) {
        setFloorPlans(plans);
        console.log("Floor plans loaded successfully:", plans.length);
        toast.success("Floor plans loaded successfully");
      } else {
        // Create a default floor plan with a properly typed paperSize
        const defaultPlan = [{
          strokes: [],
          label: "Ground Floor",
          paperSize: "infinite" as PaperSize
        }];
        setFloorPlans(defaultPlan);
        console.log("Created default floor plan");
        toast.info("No saved floor plans found. Created new default plan.");
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error loading floor plans:", error);
      setHasError(true);
      setErrorMessage("Failed to load floor plans. Please try again.");
      setIsLoading(false);
      toast.error("Failed to load floor plans");
      return false;
    }
  }, [loadData, setFloorPlans, setHasError, setErrorMessage, setIsLoading]);

  return {
    loadFloorPlansData
  };
};
