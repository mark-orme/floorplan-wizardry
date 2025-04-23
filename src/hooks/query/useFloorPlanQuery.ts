
import { useQuery } from '@tanstack/react-query';
import { FloorPlan } from '@/types/floorPlan';

export interface UseFloorPlanLoaderOptions {
  userId: string;
  refreshInterval?: number;
  initialFloorPlans?: FloorPlan[];
}

// Re-export the useFloorPlanQuery for backward compatibility
export const useFloorPlanQuery = (options?: Partial<UseFloorPlanLoaderOptions>) => {
  return useQuery({
    queryKey: ['floorPlans', options?.userId],
    queryFn: async () => {
      // Simple placeholder implementation
      return options?.initialFloorPlans || [];
    },
  });
};

// Re-export floorPlanKeys for compatibility with existing imports
export const floorPlanKeys = {
  all: ['floorPlans'] as const,
  lists: () => [...floorPlanKeys.all, 'list'] as const,
  list: (filters: string) => [...floorPlanKeys.lists(), { filters }] as const,
  details: () => [...floorPlanKeys.all, 'detail'] as const,
  detail: (id: string) => [...floorPlanKeys.details(), id] as const,
};
