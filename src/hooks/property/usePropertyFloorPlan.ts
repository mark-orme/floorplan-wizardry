
import { useState, useEffect } from 'react';
import { FloorPlan } from '@/types/floorPlanTypes';

export const usePropertyFloorPlan = (propertyId: string) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFloorPlans = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, we would fetch from an API
        // For now, we just create a mock floor plan
        const mockFloorPlan: FloorPlan = {
          id: `floor-plan-${propertyId}-1`,
          name: 'Ground Floor',
          level: 0,
          updatedAt: new Date().toISOString(),
          strokes: [],
          walls: [],
          rooms: [],
          width: 800,
          height: 600,
          backgroundColor: '#f5f5f5',
          // Add required fields for compatibility
          canvasData: null,
          canvasJson: null,
          createdAt: new Date().toISOString(),
          data: {},
          userId: 'default-user'
        };

        const mockFloorPlan2: FloorPlan = {
          id: `floor-plan-${propertyId}-2`,
          name: 'First Floor',
          level: 1,
          updatedAt: new Date().toISOString(),
          strokes: [],
          walls: [],
          rooms: [],
          width: 800,
          height: 600,
          backgroundColor: '#f5f5f5',
          // Add required fields for compatibility
          canvasData: null,
          canvasJson: null,
          createdAt: new Date().toISOString(),
          data: {},
          userId: 'default-user'
        };

        setFloorPlans([mockFloorPlan, mockFloorPlan2]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchFloorPlans();
    }
  }, [propertyId]);

  return {
    floorPlans,
    isLoading,
    error
  };
};
