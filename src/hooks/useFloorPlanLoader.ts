
/**
 * Hook for loading and managing floor plans
 * @module hooks/useFloorPlanLoader
 */
import { useState, useEffect, useCallback } from 'react';
import { FloorPlan } from '@/types/floorPlanTypes';

/**
 * Interface for the return value of the useFloorPlanLoader hook
 */
interface UseFloorPlanLoaderResult {
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  /** Function to set the floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to add a new floor plan */
  addFloorPlan: (name: string) => void;
  /** Function to remove a floor plan */
  removeFloorPlan: (id: string) => void;
  /** Function to load floor plans data */
  loadFloorPlansData: () => Promise<void>;
}

/**
 * Props for useFloorPlanLoader hook with loader extensions
 */
interface UseFloorPlanLoaderProps {
  /** Function to set loading state */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /** Function to set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set error state */
  setHasError: (value: boolean) => void;
  /** Function to set error message */
  setErrorMessage: (value: string) => void;
  /** Function to load data */
  loadData: () => Promise<unknown>;
}

/**
 * Hook for managing floor plans
 * @param initialFloorPlans - Initial floor plans to load
 * @returns Floor plan state and management functions
 */
export const useFloorPlanLoader = (
  initialFloorPlans: FloorPlan[] | UseFloorPlanLoaderProps = []
): UseFloorPlanLoaderResult => {
  // Check if we're using the props interface or just initial floor plans
  const isPropsObject = !Array.isArray(initialFloorPlans) && 
    typeof initialFloorPlans === 'object' && 
    'setIsLoading' in initialFloorPlans;

  // Initialize state with either the array or empty array
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(
    Array.isArray(initialFloorPlans) ? initialFloorPlans : []
  );
  
  /**
   * Add a new floor plan
   * @param name Floor plan name
   */
  const addFloorPlan = useCallback((name: string) => {
    const newFloorPlan = createDefaultFloorPlan(name);
    setFloorPlans(prev => [...prev, newFloorPlan]);
  }, []);
  
  /**
   * Remove a floor plan
   * @param id Floor plan ID
   */
  const removeFloorPlan = useCallback((id: string) => {
    setFloorPlans(prev => prev.filter(floorPlan => floorPlan.id !== id));
  }, []);
  
  /**
   * Create a default floor plan
   * @param name Floor plan name
   * @returns Default floor plan
   */
  const createDefaultFloorPlan = (name: string): FloorPlan => {
    return {
      id: `default-${Date.now()}`,
      name,
      label: name,
      level: 0,
      gia: 0,
      strokes: [],
      walls: [],
      rooms: [],
      canvasData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  /**
   * Load floor plans data
   * For the props interface version
   */
  const loadFloorPlansData = useCallback(async (): Promise<void> => {
    if (isPropsObject) {
      const props = initialFloorPlans as UseFloorPlanLoaderProps;
      props.setIsLoading(true);
      props.setHasError(false);
      props.setErrorMessage('');
      
      try {
        const data = await props.loadData();
        if (Array.isArray(data)) {
          props.setFloorPlans(data);
        }
      } catch (error) {
        props.setHasError(true);
        props.setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        props.setIsLoading(false);
      }
    }
    
    // Always return void for consistency
    return;
  }, [initialFloorPlans, isPropsObject]);
  
  // Load initial floor plans on mount for array version
  useEffect(() => {
    if (Array.isArray(initialFloorPlans) && initialFloorPlans.length > 0) {
      setFloorPlans(initialFloorPlans);
    }
  }, [initialFloorPlans]);
  
  return {
    floorPlans,
    setFloorPlans,
    addFloorPlan,
    removeFloorPlan,
    loadFloorPlansData
  };
};
