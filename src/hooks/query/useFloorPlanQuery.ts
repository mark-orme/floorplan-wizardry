
import { useQuery } from '@tanstack/react-query';
import { FloorPlan } from '@/types/FloorPlan';

export interface UseFloorPlanLoaderOptions {
  userId: string;
  refreshInterval?: number;
  initialFloorPlans?: FloorPlan[];
}
