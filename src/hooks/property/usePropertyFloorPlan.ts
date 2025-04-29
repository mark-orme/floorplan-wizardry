
import { useState, useEffect } from 'react';
import { FloorPlan } from '@/types/floorPlan';
import { toast } from 'sonner';

export interface UsePropertyFloorPlanProps {
  propertyId: string;
}

export const usePropertyFloorPlan = ({ propertyId }: UsePropertyFloorPlanProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load floor plans when property ID changes
  useEffect(() => {
    async function loadFloorPlans() {
      if (!propertyId) {
        setFloorPlans([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Mock data - in a real app, fetch from API
        const mockFloorPlans: FloorPlan[] = [
          {
            id: 'floor-1',
            name: 'Ground Floor',
            level: 0,
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          },
          {
            id: 'floor-2',
            name: 'First Floor',
            level: 1,
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        ];
        
        setFloorPlans(mockFloorPlans);
      } catch (err) {
        console.error('Failed to load floor plans:', err);
        setError(err instanceof Error ? err : new Error('Failed to load floor plans'));
        toast.error('Failed to load floor plans');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFloorPlans();
  }, [propertyId]);
  
  return {
    floorPlans,
    isLoading,
    error
  };
};
