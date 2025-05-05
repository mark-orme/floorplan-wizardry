import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan } from '@/utils/floorPlanTypeAdapter';
import { ensureFloorPlanMetadata } from '@/utils/floorPlanTypeAdapter';

interface UseFloorPlanManagementOptions {
  initialFloorPlans?: FloorPlan[];
  onUpdate?: (floorPlans: FloorPlan[]) => void;
}

export function useFloorPlanManagement({
  initialFloorPlans = [],
  onUpdate = () => {}
}: UseFloorPlanManagementOptions = {}) {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(
    initialFloorPlans.map(ensureFloorPlanMetadata)
  );
  
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);
  
  // Update a floor plan
  const updateFloorPlan = useCallback((updatedFloorPlan: Partial<FloorPlan>) => {
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      
      const index = updatedFloorPlan.id 
        ? newFloorPlans.findIndex(fp => fp.id === updatedFloorPlan.id)
        : -1;
        
      if (index >= 0) {
        // Use ensureFloorPlanMetadata to guarantee metadata exists
        newFloorPlans[index] = ensureFloorPlanMetadata({
          ...newFloorPlans[index],
          ...updatedFloorPlan,
          // Make sure metadata exists and is properly updated
          metadata: {
            ...newFloorPlans[index].metadata,
            ...(updatedFloorPlan.metadata || {}),
            updatedAt: new Date().toISOString()
          }
        });
      }
      
      onUpdate(newFloorPlans);
      return newFloorPlans;
    });
  }, [onUpdate]);
  
  // Create a new floor plan
  const createFloorPlan = useCallback(() => {
    const newFloorPlan: FloorPlan = ensureFloorPlanMetadata({
      id: uuidv4(),
      name: `Floor Plan ${floorPlans.length + 1}`,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
    
    setFloorPlans(prev => {
      const newFloorPlans = [...prev, newFloorPlan];
      onUpdate(newFloorPlans);
      return newFloorPlans;
    });
    
    return newFloorPlan;
  }, [floorPlans.length, onUpdate]);
  
  // Delete a floor plan
  const deleteFloorPlan = useCallback((floorPlanId: string) => {
    setFloorPlans(prev => {
      const newFloorPlans = prev.filter(fp => fp.id !== floorPlanId);
      onUpdate(newFloorPlans);
      return newFloorPlans;
    });
  }, [onUpdate]);
  
  // Select a floor plan
  const selectFloorPlan = useCallback((index: number) => {
    setCurrentFloorPlanIndex(index);
  }, []);
  
  const currentFloorPlan = floorPlans[currentFloorPlanIndex];
  
  return {
    floorPlans,
    currentFloorPlan,
    currentFloorPlanIndex,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    selectFloorPlan,
    setFloorPlans
  };
}
