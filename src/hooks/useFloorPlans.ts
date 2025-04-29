
import { useState, useCallback } from 'react';
import { FloorPlan } from '@/types/FloorPlan';
import { v4 as uuidv4 } from 'uuid';

export interface UseFloorPlansProps {
  initialFloorPlans?: FloorPlan[];
  defaultFloorPlan?: Partial<FloorPlan>;
}

export const useFloorPlans = ({
  initialFloorPlans = [],
  defaultFloorPlan = {}
}: UseFloorPlansProps = {}) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  const [currentFloorPlanId, setCurrentFloorPlanId] = useState<string | null>(
    initialFloorPlans.length > 0 ? initialFloorPlans[0].id : null
  );

  // Get the current floor plan
  const currentFloorPlan = useCallback(() => {
    return floorPlans.find(fp => fp.id === currentFloorPlanId) || null;
  }, [floorPlans, currentFloorPlanId]);

  // Create a new floor plan
  const createFloorPlan = useCallback((data: Partial<FloorPlan> = {}) => {
    const newFloorPlan: FloorPlan = {
      id: uuidv4(),
      name: 'New Floor Plan',
      data: {},
      metadata: {
        id: '',
        name: 'New Floor Plan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...defaultFloorPlan,
      ...data,
    };

    setFloorPlans(prev => [...prev, newFloorPlan]);
    setCurrentFloorPlanId(newFloorPlan.id);
    return newFloorPlan;
  }, [defaultFloorPlan]);

  // Update a floor plan
  const updateFloorPlan = useCallback((id: string, data: Partial<FloorPlan>) => {
    setFloorPlans(prev => prev.map(fp => 
      fp.id === id ? { ...fp, ...data, updated_at: new Date().toISOString() } : fp
    ));
  }, []);

  // Delete a floor plan
  const deleteFloorPlan = useCallback((id: string) => {
    setFloorPlans(prev => prev.filter(fp => fp.id !== id));
    
    // If we deleted the current floor plan, select another one if available
    if (id === currentFloorPlanId) {
      setCurrentFloorPlanId(prev => {
        const remainingPlans = floorPlans.filter(fp => fp.id !== id);
        return remainingPlans.length > 0 ? remainingPlans[0].id : null;
      });
    }
  }, [floorPlans, currentFloorPlanId]);

  return {
    floorPlans,
    setFloorPlans,
    currentFloorPlanId,
    setCurrentFloorPlanId,
    currentFloorPlan: currentFloorPlan(),
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
};
