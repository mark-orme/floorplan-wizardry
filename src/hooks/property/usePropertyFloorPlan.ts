
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloorPlan } from '@/types/fabric-unified';

interface UsePropertyFloorPlanProps {
  propertyId: string;
  enabled?: boolean;
}

export const usePropertyFloorPlan = ({ 
  propertyId, 
  enabled = true 
}: UsePropertyFloorPlanProps) => {
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null);
  
  // Query for floor plans
  const { data: floorPlans, isLoading, error } = useQuery({
    queryKey: ['propertyFloorPlans', propertyId],
    queryFn: async (): Promise<FloorPlan[]> => {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data with compatible types
      return [
        {
          id: 'floor-1',
          name: 'Ground Floor',
          label: 'Ground Floor',
          width: 800,
          height: 600,
          data: { /* Floor plan data */ },
          thumbnail: '/images/floor-1-thumb.png'
        },
        {
          id: 'floor-2',
          name: 'First Floor',
          label: 'First Floor',
          width: 800,
          height: 600,
          data: { /* Floor plan data */ },
          thumbnail: '/images/floor-2-thumb.png'
        }
      ] as unknown as FloorPlan[]; // Cast to FloorPlan[] to ensure compatibility
    },
    enabled
  });
  
  // Set the first floor plan as selected when data loads
  useEffect(() => {
    if (floorPlans && floorPlans.length > 0 && !selectedFloorPlan) {
      setSelectedFloorPlan(floorPlans[0].id);
    }
  }, [floorPlans, selectedFloorPlan]);
  
  // Get the currently selected floor plan
  const currentFloorPlan = useCallback(() => {
    if (!floorPlans || !selectedFloorPlan) return null;
    return floorPlans.find(plan => plan.id === selectedFloorPlan) || null;
  }, [floorPlans, selectedFloorPlan]);
  
  return {
    floorPlans: floorPlans || [],
    selectedFloorPlan,
    setSelectedFloorPlan,
    currentFloorPlan: currentFloorPlan(),
    isLoading,
    error
  };
};
