
/**
 * Hook for loading and managing floor plans
 * @module hooks/useFloorPlanLoader
 */
import { useState, useCallback } from 'react';
import { FloorPlan, createFloorPlan } from '@/types/core/FloorPlan';

/**
 * Props for useFloorPlanLoader hook
 */
interface UseFloorPlanLoaderProps {
  /** Initial floor plans */
  initialFloorPlans?: FloorPlan[];
  
  /** Default floor index */
  defaultFloorIndex?: number;
}

/**
 * Result type for useFloorPlanLoader hook
 */
interface UseFloorPlanLoaderResult {
  /** Array of floor plans */
  floorPlans: FloorPlan[];
  
  /** Current floor index */
  currentFloor: number;
  
  /** Whether floor plans are loading */
  isLoading: boolean;
  
  /** Load floor plans */
  loadFloorPlans: () => Promise<FloorPlan[]>;
  
  /** Set floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  
  /** Select a floor */
  selectFloor: (floorIndex: number) => void;
  
  /** Add a new floor */
  addFloor: () => void;
}

/**
 * Hook for loading and managing floor plans
 * @param props - Hook properties
 * @returns Floor plan operations and state
 */
export const useFloorPlanLoader = (props: UseFloorPlanLoaderProps = {}): UseFloorPlanLoaderResult => {
  const { initialFloorPlans = [], defaultFloorIndex = 0 } = props;
  
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloor, setCurrentFloor] = useState<number>(defaultFloorIndex);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  /**
   * Load floor plans
   * @returns Promise that resolves to floor plans
   */
  const loadFloorPlans = useCallback(async (): Promise<FloorPlan[]> => {
    setIsLoading(true);
    
    try {
      // Simulate loading data (replace with actual API call if needed)
      if (floorPlans.length === 0) {
        // Create default floor plan if none exist
        const defaultFloorPlan = createFloorPlan('floor-0', 'Ground Floor');
        setFloorPlans([defaultFloorPlan]);
      }
      
      setIsLoading(false);
      return floorPlans;
    } catch (error) {
      console.error('Error loading floor plans:', error);
      setIsLoading(false);
      return floorPlans;
    }
  }, [floorPlans]);
  
  /**
   * Select a floor
   * @param floorIndex - Index of floor to select
   */
  const selectFloor = useCallback((floorIndex: number): void => {
    if (floorIndex >= 0 && floorIndex < floorPlans.length) {
      setCurrentFloor(floorIndex);
    }
  }, [floorPlans.length]);
  
  /**
   * Add a new floor
   */
  const addFloor = useCallback((): void => {
    const newFloorIndex = floorPlans.length;
    const newFloorPlan = createFloorPlan(
      `floor-${newFloorIndex}`,
      `Floor ${newFloorIndex + 1}`,
      newFloorIndex
    );
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloor(newFloorIndex);
  }, [floorPlans.length]);
  
  return {
    floorPlans,
    currentFloor,
    isLoading,
    loadFloorPlans,
    setFloorPlans,
    selectFloor,
    addFloor
  };
};
