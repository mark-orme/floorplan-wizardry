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
}

/**
 * Hook for managing floor plans
 * @param initialFloorPlans - Initial floor plans to load
 * @returns Floor plan state and management functions
 */
export const useFloorPlanLoader = (initialFloorPlans: FloorPlan[] = []): UseFloorPlanLoaderResult => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  
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
      level: 0, // Add missing level property
      gia: 0,
      strokes: [],
      walls: [],
      rooms: [],
      canvasData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };
  
  // Load initial floor plans on mount
  useEffect(() => {
    if (initialFloorPlans.length > 0) {
      setFloorPlans(initialFloorPlans);
    }
  }, [initialFloorPlans]);
  
  return {
    floorPlans,
    setFloorPlans,
    addFloorPlan,
    removeFloorPlan
  };
};
