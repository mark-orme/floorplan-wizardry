
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/FloorPlan';

export interface UseSyncedFloorPlansResult {
  floorPlans: FloorPlan[];
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  addFloorPlan: (floorPlan: FloorPlan) => void;
  removeFloorPlan: (id: string) => void;
  syncFloorPlans: (canvas: FabricCanvas, floorPlans: FloorPlan[]) => void;
  loadFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => void;
  calculateGIA: (floorPlans: FloorPlan[]) => number;
}

/**
 * Hook for managing synchronized floor plans with local storage
 * @returns Floor plan management functions and state
 */
export const useSyncedFloorPlans = (): UseSyncedFloorPlansResult => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);

  // Load floor plans from localStorage on initialization
  useEffect(() => {
    try {
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans) {
        setFloorPlans(JSON.parse(storedFloorPlans));
      }
    } catch (error) {
      console.error('Failed to load floor plans:', error);
      toast.error('Failed to load floor plans');
    }
  }, []);

  // Save floor plans to localStorage when updated
  useEffect(() => {
    if (floorPlans.length > 0) {
      try {
        localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      } catch (error) {
        console.error('Failed to save floor plans:', error);
        toast.error('Failed to save floor plans');
      }
    }
  }, [floorPlans]);

  // Add a new floor plan
  const addFloorPlan = useCallback((floorPlan: FloorPlan) => {
    setFloorPlans(prev => [...prev, floorPlan]);
  }, []);

  // Remove a floor plan by ID
  const removeFloorPlan = useCallback((id: string) => {
    setFloorPlans(prev => prev.filter(fp => fp.id !== id));
  }, []);

  // Sync floor plans with canvas (save canvas state to floor plans)
  const syncFloorPlans = useCallback((canvas: FabricCanvas, floorPlans: FloorPlan[]) => {
    console.log('Syncing floor plans with canvas:', floorPlans.length);
    // Implementation would save canvas state to the floor plans
  }, []);

  // Load a floor plan to canvas
  const loadFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    console.log('Loading floor plan to canvas:', floorPlan.name);
    // Implementation would load the floor plan onto the canvas
  }, []);

  // Calculate total GIA from all floor plans
  const calculateGIA = useCallback((floorPlans: FloorPlan[]): number => {
    return floorPlans.reduce((total, fp) => total + (fp.gia || 0), 0);
  }, []);

  return {
    floorPlans,
    setFloorPlans,
    addFloorPlan,
    removeFloorPlan,
    syncFloorPlans,
    loadFloorPlan,
    calculateGIA
  };
};
