
/**
 * Hook for loading floor plan data in the canvas controller
 * @module useCanvasControllerLoader
 */
import { useEffect, useCallback } from "react";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Props for the useCanvasControllerLoader hook
 * 
 * @interface UseCanvasControllerLoaderProps
 * @property {React.Dispatch<React.SetStateAction<FloorPlan[]>>} setFloorPlans - Function to update floor plans state
 * @property {(value: boolean) => void} setHasError - Function to update error state
 * @property {(value: string) => void} setErrorMessage - Function to update error message
 * @property {() => Promise<unknown>} loadData - Function to load floor plan data
 */
interface UseCanvasControllerLoaderProps {
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
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  } = props;

  // Floor plan data loading
  const floorPlanLoader = useFloorPlanLoader({
    initialFloorPlans: [],
    defaultFloorIndex: 0
  });

  /**
   * Load floor plans data from loader
   * Uses the loader's loadFloorPlans method
   * 
   * @returns {Promise<void>} Promise that resolves when data is loaded
   */
  const loadFloorPlansData = useCallback(async (): Promise<void> => {
    try {
      const plans = await floorPlanLoader.loadFloorPlans();
      
      // Convert each plan to the required FloorPlan type with all required properties
      const typedPlans: FloorPlan[] = plans.map(plan => {
        // Create a properly typed FloorPlan with all required fields
        const typedPlan: FloorPlan = {
          id: plan.id || '',
          name: plan.name || '',
          label: plan.label || plan.name || '',
          index: typeof plan.index !== 'undefined' ? Number(plan.index) : (plan.metadata?.level || 0),
          strokes: Array.isArray(plan.strokes) ? plan.strokes.map(stroke => ({
            ...stroke,
            width: stroke.width || stroke.thickness || 1
          })) : [],
          walls: plan.walls || [],
          rooms: plan.rooms || [],
          metadata: plan.metadata || {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            paperSize: plan.paperSize || 'CUSTOM',
            level: plan.level || 0
          },
          canvasJson: plan.canvasJson || '',
          gia: plan.gia || 0,
          level: plan.level || 0,
          canvasData: plan.canvasData || null,
          createdAt: plan.createdAt || new Date().toISOString(),
          updatedAt: plan.updatedAt || new Date().toISOString()
        };
        
        return typedPlan;
      });
      
      setFloorPlans(typedPlans);
    } catch (error) {
      console.error("Error loading floor plans", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load floor plans");
    }
    return;
  }, [floorPlanLoader, setFloorPlans, setHasError, setErrorMessage]);

  // Load floor plans data on mount
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  return {
    loadFloorPlansData
  };
};
