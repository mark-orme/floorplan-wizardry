
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FloorPlan } from '@/types/floorPlan';

export const usePropertyFloorPlan = () => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [selectedFloorPlanId, setSelectedFloorPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get the currently selected floor plan
  const selectedFloorPlan = floorPlans.find(fp => fp.id === selectedFloorPlanId) || null;

  // Fetch floor plans
  const fetchFloorPlans = useCallback(async (propertyId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, create some mock floor plans
      const mockFloorPlans: FloorPlan[] = [
        {
          id: 'fp-1',
          name: 'Ground Floor',
          level: 0,
          updatedAt: new Date().toISOString(),
          strokes: [],
          width: 1000,
          height: 800,
          backgroundColor: '#ffffff'
        },
        {
          id: 'fp-2',
          name: 'First Floor',
          level: 1,
          updatedAt: new Date().toISOString(),
          strokes: [],
          width: 1000,
          height: 800,
          backgroundColor: '#ffffff'
        }
      ];
      
      setFloorPlans(mockFloorPlans);
      if (mockFloorPlans.length > 0) {
        setSelectedFloorPlanId(mockFloorPlans[0].id);
      }
      
      return mockFloorPlans;
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('Failed to fetch floor plans');
      setError(fetchError);
      toast.error(`Error: ${fetchError.message}`);
      throw fetchError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new floor plan
  const addFloorPlan = useCallback((propertyId: string, floorPlan: Omit<FloorPlan, 'id'>) => {
    const newFloorPlan: FloorPlan = {
      ...floorPlan,
      id: `fp-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    
    setFloorPlans(prev => [...prev, newFloorPlan]);
    setSelectedFloorPlanId(newFloorPlan.id);
    toast.success('Floor plan added');
    
    return newFloorPlan;
  }, []);

  // Update a floor plan
  const updateFloorPlan = useCallback((floorPlanId: string, updates: Partial<FloorPlan>) => {
    setFloorPlans(prev => 
      prev.map(fp => 
        fp.id === floorPlanId 
          ? { ...fp, ...updates, updatedAt: new Date().toISOString() } 
          : fp
      )
    );
    
    toast.success('Floor plan updated');
  }, []);

  // Delete a floor plan
  const deleteFloorPlan = useCallback((floorPlanId: string) => {
    setFloorPlans(prev => prev.filter(fp => fp.id !== floorPlanId));
    
    if (selectedFloorPlanId === floorPlanId) {
      const remainingFloorPlans = floorPlans.filter(fp => fp.id !== floorPlanId);
      setSelectedFloorPlanId(remainingFloorPlans.length > 0 ? remainingFloorPlans[0].id : null);
    }
    
    toast.success('Floor plan deleted');
  }, [floorPlans, selectedFloorPlanId]);

  return {
    floorPlans,
    selectedFloorPlan,
    selectedFloorPlanId,
    setSelectedFloorPlanId,
    isLoading,
    error,
    fetchFloorPlans,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
};
