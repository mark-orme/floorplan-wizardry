
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, createEmptyFloorPlan } from '@/types/FloorPlan';
import { toast } from 'sonner';

export const useSyncedFloorPlans = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);

  // Load floor plans from localStorage on init
  useEffect(() => {
    try {
      const storedFloorPlans = localStorage.getItem('floorPlans');
      if (storedFloorPlans) {
        setFloorPlans(JSON.parse(storedFloorPlans));
      }
    } catch (error) {
      console.error('Failed to load floor plans from localStorage:', error);
      toast.error('Failed to load floor plans');
    }
  }, []);

  // Save floor plans to localStorage when they change
  useEffect(() => {
    if (floorPlans.length > 0) {
      try {
        localStorage.setItem('floorPlans', JSON.stringify(floorPlans));
      } catch (error) {
        console.error('Failed to save floor plans to localStorage:', error);
        toast.error('Failed to save floor plans');
      }
    }
  }, [floorPlans]);

  // Sync floor plans with canvas
  const syncFloorPlans = useCallback((canvas: FabricCanvas, updatedFloorPlans: FloorPlan[]) => {
    // Implementation would load floor plans into canvas
    console.log('Syncing floor plans with canvas');
  }, []);

  // Load a specific floor plan to canvas
  const loadFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    // Implementation would load a floor plan into canvas
    console.log('Loading floor plan to canvas');
  }, []);

  // Calculate total GIA from all floor plans
  const calculateGIA = useCallback((plans: FloorPlan[] = floorPlans): number => {
    return plans.reduce((sum, plan) => sum + (plan.gia || 0), 0);
  }, [floorPlans]);

  return {
    floorPlans,
    setFloorPlans,
    syncFloorPlans,
    loadFloorPlan,
    calculateGIA
  };
};
