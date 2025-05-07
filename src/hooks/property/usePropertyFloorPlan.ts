
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FloorPlan } from '@/types/fabric-unified';

export const usePropertyFloorPlan = (propertyId?: string, floorPlanId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Query to fetch the floor plan
  const { data: floorPlan, isLoading, refetch } = useQuery({
    queryKey: ['floorPlan', propertyId, floorPlanId],
    queryFn: async () => {
      if (!propertyId || !floorPlanId) {
        return null;
      }
      
      // Mock implementation - replace with actual API call
      return {
        id: floorPlanId,
        name: 'Floor Plan',
        width: 800,
        height: 600,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        data: null
      } as FloorPlan;
    },
    enabled: !!propertyId && !!floorPlanId
  });
  
  // Save floor plan
  const saveFloorPlan = useCallback(async (data: any) => {
    if (!propertyId || !floorPlanId) {
      setError('Missing property ID or floor plan ID');
      return null;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedFloorPlan = {
        id: floorPlanId,
        name: floorPlan?.name || 'Floor Plan',
        width: floorPlan?.width || 800,
        height: floorPlan?.height || 600,
        created: floorPlan?.created || new Date().toISOString(),
        updated: new Date().toISOString(),
        data
      };
      
      // Refresh data
      await refetch();
      
      return updatedFloorPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save floor plan');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [propertyId, floorPlanId, floorPlan, refetch]);
  
  return {
    floorPlan,
    isLoading,
    isSubmitting,
    error,
    saveFloorPlan,
    refetch
  };
};
