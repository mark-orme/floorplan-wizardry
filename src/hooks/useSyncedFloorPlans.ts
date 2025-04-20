
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FloorPlan } from '@/types/floorPlanTypes';
import { createEmptyFloorPlan } from '@/types/floor-plan/factoryFunctions';

interface UseSyncedFloorPlansResult {
  floorPlans: FloorPlan[];
  currentFloorIndex: number;
  isLoading: boolean;
  error: string | null;
  addFloorPlan: () => void;
  updateFloorPlan: (index: number, floorPlan: FloorPlan) => void;
  removeFloorPlan: (index: number) => void;
  setCurrentFloorIndex: (index: number) => void;
}

export const useSyncedFloorPlans = (initialFloorIndex = 0): UseSyncedFloorPlansResult => {
  const [floorPlans, setFloorPlans] = useLocalStorage<FloorPlan[]>('floorPlans', []);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(initialFloorIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with a default floor plan if none exist
  useEffect(() => {
    if (floorPlans.length === 0) {
      const defaultFloorPlan = createEmptyFloorPlan({
        id: uuidv4(),
        name: 'Ground Floor',
        label: 'Ground Floor',
        level: 0,
        index: 0,
        data: {},
        userId: 'default-user'
      });
      
      setFloorPlans([defaultFloorPlan]);
    }
  }, [floorPlans.length, setFloorPlans]);

  // Add a new floor plan
  const addFloorPlan = useCallback(() => {
    const newIndex = floorPlans.length;
    const newFloorPlan = createEmptyFloorPlan({
      id: uuidv4(),
      name: `Floor ${newIndex + 1}`,
      label: `Floor ${newIndex + 1}`,
      level: newIndex,
      index: newIndex,
      data: {},
      userId: 'default-user'
    });
    
    setFloorPlans([...floorPlans, newFloorPlan]);
    setCurrentFloorIndex(newIndex);
  }, [floorPlans, setFloorPlans]);

  // Update a floor plan
  const updateFloorPlan = useCallback((index: number, floorPlan: FloorPlan) => {
    if (index < 0 || index >= floorPlans.length) {
      setError(`Invalid floor index: ${index}`);
      return;
    }
    
    const updatedFloorPlans = [...floorPlans];
    updatedFloorPlans[index] = {
      ...floorPlan,
      updatedAt: new Date().toISOString()
    };
    
    setFloorPlans(updatedFloorPlans);
  }, [floorPlans, setFloorPlans]);

  // Remove a floor plan
  const removeFloorPlan = useCallback((index: number) => {
    if (index < 0 || index >= floorPlans.length) {
      setError(`Invalid floor index: ${index}`);
      return;
    }
    
    const updatedFloorPlans = floorPlans.filter((_, i) => i !== index);
    setFloorPlans(updatedFloorPlans);
    
    // Adjust current floor index if needed
    if (currentFloorIndex >= updatedFloorPlans.length) {
      setCurrentFloorIndex(Math.max(0, updatedFloorPlans.length - 1));
    }
  }, [floorPlans, currentFloorIndex, setFloorPlans]);

  return {
    floorPlans,
    currentFloorIndex,
    isLoading,
    error,
    addFloorPlan,
    updateFloorPlan,
    removeFloorPlan,
    setCurrentFloorIndex
  };
};
