
import { useState, useEffect, useCallback } from 'react';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createEmptyFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { toast } from 'sonner';

interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  loadFloorPlans?: () => Promise<FloorPlan[]>;
  saveFloorPlans?: (floorPlans: FloorPlan[]) => Promise<void>;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  loadFloorPlans = async () => initialFloorPlans,
  saveFloorPlans = async () => {}
}: UseSyncedFloorPlansProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFloorPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loadedFloorPlans = await loadFloorPlans();
        setFloorPlans(loadedFloorPlans);
      } catch (e: any) {
        setError(e.message || 'Failed to load floor plans');
        toast.error('Failed to load floor plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloorPlans();
  }, [loadFloorPlans]);

  const syncFloorPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await saveFloorPlans(floorPlans);
      toast.success('Floor plans saved successfully');
    } catch (e: any) {
      setError(e.message || 'Failed to sync floor plans');
      toast.error('Failed to sync floor plans');
    } finally {
      setIsLoading(false);
    }
  }, [floorPlans, saveFloorPlans]);

  const addFloorPlan = useCallback(() => {
    const newFloorPlan = createEmptyFloorPlan();
    setFloorPlans(prev => [...prev, newFloorPlan]);
  }, []);
  
  // Alias for createFloorPlan to maintain compatibility with tests
  const createFloorPlan = useCallback((data: Partial<FloorPlan> = {}) => {
    const newFloorPlan = createEmptyFloorPlan();
    // Apply any custom data
    const customizedFloorPlan = { ...newFloorPlan, ...data };
    setFloorPlans(prev => [...prev, customizedFloorPlan]);
    return customizedFloorPlan;
  }, []);

  const updateFloorPlan = useCallback((index: number, updatedFloorPlan: FloorPlan) => {
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      newFloorPlans[index] = updatedFloorPlan;
      return newFloorPlans;
    });
  }, []);

  // Support for both index-based and id-based deletion
  const deleteFloorPlan = useCallback((indexOrId: number | string) => {
    if (typeof indexOrId === 'number') {
      setFloorPlans(prev => prev.filter((_, i) => i !== indexOrId));
    } else {
      setFloorPlans(prev => prev.filter(plan => plan.id !== indexOrId));
    }
  }, []);

  return {
    floorPlans,
    setFloorPlans,
    isLoading,
    error,
    syncFloorPlans,
    addFloorPlan,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
  };
};
