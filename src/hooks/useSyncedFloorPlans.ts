import { useState, useEffect, useCallback } from 'react';
import { FloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { createFloorPlan } from '@/types/core/floor-plan/helpers';

interface UseSyncedFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  loadFloorPlans: () => Promise<FloorPlan[]>;
  saveFloorPlans: (floorPlans: FloorPlan[]) => Promise<void>;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans = [],
  loadFloorPlans,
  saveFloorPlans,
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
    } catch (e: any) {
      setError(e.message || 'Failed to sync floor plans');
    } finally {
      setIsLoading(false);
    }
  }, [floorPlans, saveFloorPlans]);

  const addFloorPlan = useCallback(() => {
    const emptyFloorPlan = createFloorPlan();
    setFloorPlans(prev => [...prev, emptyFloorPlan]);
  }, []);

  const updateFloorPlan = useCallback((index: number, updatedFloorPlan: FloorPlan) => {
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      newFloorPlans[index] = updatedFloorPlan;
      return newFloorPlans;
    });
  }, []);

  const deleteFloorPlan = useCallback((index: number) => {
    setFloorPlans(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    floorPlans,
    setFloorPlans,
    isLoading,
    error,
    syncFloorPlans,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
  };
};
