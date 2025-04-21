import { useState, useEffect, useCallback } from 'react';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

interface UseSyncedFloorPlansProps {
  initialFloorPlans: FloorPlan[];
  onFloorPlansChange: (floorPlans: FloorPlan[]) => void;
}

export const useSyncedFloorPlans = ({
  initialFloorPlans,
  onFloorPlansChange
}: UseSyncedFloorPlansProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>(initialFloorPlans);
  
  useEffect(() => {
    setFloorPlans(initialFloorPlans);
  }, [initialFloorPlans]);
  
  useEffect(() => {
    onFloorPlansChange(floorPlans);
  }, [floorPlans, onFloorPlansChange]);
  
  const updateFloorPlan = useCallback((index: number, updatedFloorPlan: FloorPlan) => {
    setFloorPlans(prevFloorPlans => {
      const newFloorPlans = [...prevFloorPlans];
      
      // Ensure the updatedFloorPlan metadata has all required fields
      const safeMetadata = {
        version: updatedFloorPlan.metadata?.version || '1.0',
        author: updatedFloorPlan.metadata?.author || 'User',
        dateCreated: updatedFloorPlan.metadata?.dateCreated || new Date().toISOString(),
        lastModified: updatedFloorPlan.metadata?.lastModified || new Date().toISOString(),
        notes: updatedFloorPlan.metadata?.notes || '',
        createdAt: updatedFloorPlan.metadata?.createdAt || new Date().toISOString(),
        updatedAt: updatedFloorPlan.metadata?.updatedAt || new Date().toISOString()
      };
      
      newFloorPlans[index] = {
        ...updatedFloorPlan,
        metadata: safeMetadata
      };
      
      return newFloorPlans;
    });
  }, []);
  
  return {
    floorPlans,
    setFloorPlans,
    updateFloorPlan
  };
};
