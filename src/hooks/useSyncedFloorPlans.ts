
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { FloorPlan, createEmptyFloorPlan } from '@/types/FloorPlan';

/**
 * Hook for synchronized floor plans
 * Handles loading, saving, and syncing floor plans with canvas
 */
export const useSyncedFloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Load floor plans from localStorage on mount
  useEffect(() => {
    try {
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans) {
        const parsedFloorPlans = JSON.parse(storedFloorPlans);
        setFloorPlans(parsedFloorPlans);
      }
    } catch (err) {
      console.error('Error loading floor plans:', err);
      setError('Failed to load floor plans');
      toast.error('Failed to load floor plans');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save floor plans to localStorage when updated
  useEffect(() => {
    if (floorPlans.length > 0) {
      try {
        localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      } catch (err) {
        console.error('Error saving floor plans:', err);
        setError('Failed to save floor plans');
        toast.error('Failed to save floor plans');
      }
    }
  }, [floorPlans]);

  // Fetch floor plans from remote source
  const fetchFloorPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from a remote API
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans) {
        const parsedFloorPlans = JSON.parse(storedFloorPlans);
        setFloorPlans(parsedFloorPlans);
      }
      return floorPlans;
    } catch (err) {
      console.error('Error fetching floor plans:', err);
      setError('Failed to fetch floor plans');
      toast.error('Failed to fetch floor plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [floorPlans]);

  // Add a new floor plan
  const addFloorPlan = useCallback(async () => {
    try {
      const newFloorPlan = createEmptyFloorPlan({
        id: `floor-${Date.now()}`,
        name: `Floor ${floorPlans.length + 1}`,
        index: floorPlans.length
      });
      
      setFloorPlans(prev => [...prev, newFloorPlan]);
      toast.success(`Added new floor plan: ${newFloorPlan.name}`);
    } catch (err) {
      console.error('Error adding floor plan:', err);
      setError('Failed to add floor plan');
      toast.error('Failed to add floor plan');
    }
  }, [floorPlans]);

  // Update an existing floor plan
  const updateFloorPlan = useCallback(async (floorPlanId: string, updates: Partial<FloorPlan>) => {
    try {
      setFloorPlans(prev => 
        prev.map(fp => 
          fp.id === floorPlanId ? { ...fp, ...updates, updatedAt: new Date().toISOString() } : fp
        )
      );
    } catch (err) {
      console.error('Error updating floor plan:', err);
      setError('Failed to update floor plan');
      toast.error('Failed to update floor plan');
    }
  }, []);

  // Delete a floor plan
  const deleteFloorPlan = useCallback(async (floorPlanId: string) => {
    try {
      setFloorPlans(prev => prev.filter(fp => fp.id !== floorPlanId));
      toast.success('Floor plan deleted');
      return true;
    } catch (err) {
      console.error('Error deleting floor plan:', err);
      setError('Failed to delete floor plan');
      toast.error('Failed to delete floor plan');
      return false;
    }
  }, []);

  // Reorder floor plans
  const reorderFloorPlans = useCallback(async (newOrder: FloorPlan[]) => {
    try {
      // Update indexes based on new order
      const reorderedFloorPlans = newOrder.map((fp, index) => ({
        ...fp,
        index,
        updatedAt: new Date().toISOString()
      }));
      
      setFloorPlans(reorderedFloorPlans);
    } catch (err) {
      console.error('Error reordering floor plans:', err);
      setError('Failed to reorder floor plans');
      toast.error('Failed to reorder floor plans');
    }
  }, []);

  // Sync floor plans with canvas
  const syncFloorPlans = useCallback((canvas: FabricCanvas, plans: FloorPlan[]) => {
    // In a real implementation, this would sync canvas state with floor plans
    console.log('Sync floor plans with canvas', plans.length);
  }, []);

  // Load a floor plan to canvas
  const loadFloorPlan = useCallback((canvas: FabricCanvas, plan: FloorPlan) => {
    // In a real implementation, this would load a floor plan into the canvas
    console.log('Load floor plan to canvas', plan.id);
    
    // If there's canvas JSON data, load it
    if (plan.canvasJson) {
      try {
        canvas.loadFromJSON(plan.canvasJson, () => {
          canvas.renderAll();
          toast.success(`Loaded floor plan: ${plan.name}`);
        });
      } catch (err) {
        console.error('Error loading floor plan to canvas:', err);
        toast.error('Failed to load floor plan');
      }
    }
  }, []);

  // Calculate total Gross Internal Area
  const calculateGIA = useCallback((plans: FloorPlan[] = floorPlans): number => {
    return plans.reduce((total, plan) => total + (plan.gia || 0), 0);
  }, [floorPlans]);

  return {
    floorPlans,
    isLoading,
    error,
    setFloorPlans,
    fetchFloorPlans,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    reorderFloorPlans,
    syncFloorPlans,
    loadFloorPlan,
    calculateGIA
  };
};

export default useSyncedFloorPlans;
