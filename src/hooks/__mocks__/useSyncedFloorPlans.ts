
import { FloorPlan } from '@/types/FloorPlan';

// Mock implementation for useSyncedFloorPlans
export const useSyncedFloorPlans = () => {
  const mockFloorPlans: FloorPlan[] = [];
  
  const fetchFloorPlans = jest.fn().mockResolvedValue(mockFloorPlans);
  const addFloorPlan = jest.fn().mockResolvedValue(undefined);
  const updateFloorPlan = jest.fn().mockResolvedValue(undefined);
  const deleteFloorPlan = jest.fn().mockResolvedValue(undefined);
  const reorderFloorPlans = jest.fn().mockResolvedValue(undefined);
  
  // Add missing methods for tests
  const setFloorPlans = jest.fn();
  const syncFloorPlans = jest.fn().mockResolvedValue(undefined);
  const loadFloorPlan = jest.fn().mockResolvedValue(undefined);
  const calculateGIA = jest.fn().mockReturnValue(100);

  return {
    floorPlans: mockFloorPlans,
    isLoading: false,
    error: '',
    fetchFloorPlans,
    addFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    reorderFloorPlans,
    // Add missing methods
    setFloorPlans,
    syncFloorPlans,
    loadFloorPlan,
    calculateGIA
  };
};

export default useSyncedFloorPlans;
