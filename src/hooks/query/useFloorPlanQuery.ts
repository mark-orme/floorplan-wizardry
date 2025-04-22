import { useQuery, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/core';
import { useAsyncState } from './useAsyncState';
import { useFloorPlanLoader } from '@/hooks/useFloorPlanLoader';

// Query keys for caching
export const floorPlanKeys = {
  all: ['floorPlans'] as const,
  lists: () => [...floorPlanKeys.all, 'list'] as const,
  list: (filters: string) => [...floorPlanKeys.lists(), { filters }] as const,
  details: () => [...floorPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...floorPlanKeys.details(), id] as const,
};

/**
 * Hook for loading floor plans with proper caching and error handling
 */
export function useFloorPlanQuery(propertyId?: string) {
  const floorPlanLoader = useFloorPlanLoader({
    initialFloorPlans: [],
    defaultFloorIndex: 0
  });

  const queryKey: QueryKey = propertyId 
    ? floorPlanKeys.detail(propertyId)
    : floorPlanKeys.lists();
  
  const {
    data: floorPlans,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const plans = await floorPlanLoader.loadFloorPlans();
        return plans;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load floor plans';
        console.error('Error loading floor plans:', error);
        toast.error(errorMessage);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use standardized state hook
  const state = useAsyncState(
    isLoading,
    isError,
    error as Error | null,
    floorPlans,
    []
  );

  return {
    ...state,
    floorPlans: state.data,
    refetch,
  };
}
