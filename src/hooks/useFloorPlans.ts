
import { useState, useEffect } from 'react';
import { FloorPlan } from '@/types/fabric-unified';

export const useFloorPlans = (propertyId: string) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchFloorPlans = async () => {
      if (!propertyId) {
        setFloorPlans([]);
        setLoading(false);
        return;
      }
      
      try {
        // In real app, this would be an API call
        // Mock data for now
        const mockPlans: FloorPlan[] = [
          {
            id: '1',
            name: 'Ground Floor',
            width: 800,
            height: 600,
            level: 0,
            updatedAt: new Date().toISOString(),
            walls: [],
            rooms: [],
            strokes: [],
            data: {},
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          },
          {
            id: '2',
            name: 'First Floor',
            width: 800,
            height: 600,
            level: 1,
            updatedAt: new Date().toISOString(),
            walls: [],
            rooms: [],
            strokes: [],
            data: {},
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        ];
        
        setFloorPlans(mockPlans);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch floor plans'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchFloorPlans();
  }, [propertyId]);
  
  return {
    floorPlans,
    loading,
    error,
    refreshFloorPlans: () => {
      setLoading(true);
      // This would trigger the useEffect
    }
  };
};

export default useFloorPlans;
