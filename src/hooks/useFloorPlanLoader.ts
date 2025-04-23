
import { useState, useCallback } from 'react';
import type { FloorPlan } from '@/types/floorPlanTypes';

interface UseFloorPlanLoaderOptions {
  initialLoadingState?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Hook for loading and managing floor plans
 */
export const useFloorPlanLoader = (options: UseFloorPlanLoaderOptions = {}) => {
  const { initialLoadingState = false, onError } = options;
  
  const [loading, setLoading] = useState<boolean>(initialLoadingState);
  const [error, setError] = useState<Error | null>(null);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  
  /**
   * Load floor plans from API
   */
  const loadFloorPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated API call
      const response = await fetch('/api/floor-plans');
      
      if (!response.ok) {
        throw new Error(`Failed to load floor plans: ${response.status}`);
      }
      
      const data = await response.json();
      setFloorPlans(data);
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) onError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [onError]);
  
  /**
   * Load a specific floor plan by ID
   */
  const loadFloorPlan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated API call
      const response = await fetch(`/api/floor-plans/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load floor plan: ${response.status}`);
      }
      
      const data = await response.json();
      setCurrentFloorPlan(data);
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) onError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [onError]);
  
  return {
    loading,
    error,
    floorPlans,
    currentFloorPlan,
    loadFloorPlans,
    loadFloorPlan,
    setFloorPlans,
    setCurrentFloorPlan
  };
};
