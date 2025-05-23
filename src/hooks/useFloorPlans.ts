
import { useState, useCallback } from 'react';
import { FloorPlan } from '@/utils/floorPlanTypeAdapter';

interface UseFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
}

export const useFloorPlans = ({ initialFloorPlans = [] }: UseFloorPlansProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [selectedFloorPlanIndex, setSelectedFloorPlanIndex] = useState<number>(0);
  
  // Get the current selected floor plan
  const currentFloorPlan = floorPlans[selectedFloorPlanIndex];
  
  // Add a new floor plan
  const addFloorPlan = useCallback((floorPlan: Partial<FloorPlan>) => {
    const now = new Date().toISOString();
    
    const newFloorPlan: FloorPlan = {
      id: floorPlan.id || `floor-plan-${Date.now()}`,
      name: floorPlan.name || 'New Floor Plan',
      description: floorPlan.description || '',
      createdAt: now,
      updated: now,
      modified: now,
      width: floorPlan.width || 800,
      height: floorPlan.height || 600,
      ...floorPlan
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    return newFloorPlan;
  }, []);
  
  // Update a floor plan
  const updateFloorPlan = useCallback((index: number, updates: Partial<FloorPlan>) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          ...updates,
          updated: new Date().toISOString(),
          modified: new Date().toISOString()
        };
      }
      return updated;
    });
  }, []);
  
  // Delete a floor plan
  const deleteFloorPlan = useCallback((index: number) => {
    setFloorPlans(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Adjust selected index if needed
    if (selectedFloorPlanIndex >= index) {
      setSelectedFloorPlanIndex(prev => Math.max(0, prev - 1));
    }
  }, [selectedFloorPlanIndex]);
  
  // Select a floor plan
  const selectFloorPlan = useCallback((index: number) => {
    if (index >= 0 && index < floorPlans.length) {
      setSelectedFloorPlanIndex(index);
    }
  }, [floorPlans.length]);
  
  return {
    floorPlans,
    setFloorPlans,
    currentFloorPlan,
    selectedFloorPlanIndex,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    selectFloorPlan,
    setSelectedFloorPlanIndex
  };
};
