
import { useState, useEffect, useCallback } from 'react';

interface FloorPlan {
  id: string;
  name: string;
  data: any;
}

interface CustomApis {
  fetchFloorPlans?: (projectId: string) => Promise<FloorPlan[]>;
  createFloorPlan?: (projectId: string, name: string) => Promise<FloorPlan>;
  updateFloorPlan?: (projectId: string, planId: string, data: Partial<FloorPlan>) => Promise<FloorPlan>;
  deleteFloorPlan?: (projectId: string, planId: string) => Promise<{ success: boolean }>;
}

interface UseSyncedFloorPlansProps {
  projectId: string;
  customApis?: CustomApis;
  pollingInterval?: number;
}

export const useSyncedFloorPlans = ({
  projectId,
  customApis = {},
  pollingInterval = 30000
}: UseSyncedFloorPlansProps) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default API implementations
  const defaultFetchFloorPlans = useCallback(async (projectId: string): Promise<FloorPlan[]> => {
    const response = await fetch(`/api/projects/${projectId}/floor-plans`);
    if (!response.ok) throw new Error('Failed to fetch floor plans');
    return response.json();
  }, []);

  const defaultCreateFloorPlan = useCallback(async (projectId: string, name: string): Promise<FloorPlan> => {
    const response = await fetch(`/api/projects/${projectId}/floor-plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create floor plan');
    return response.json();
  }, []);

  const defaultUpdateFloorPlan = useCallback(async (
    projectId: string, 
    planId: string, 
    data: Partial<FloorPlan>
  ): Promise<FloorPlan> => {
    const response = await fetch(`/api/projects/${projectId}/floor-plans/${planId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update floor plan');
    return response.json();
  }, []);

  const defaultDeleteFloorPlan = useCallback(async (
    projectId: string, 
    planId: string
  ): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/projects/${projectId}/floor-plans/${planId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete floor plan');
    return { success: true };
  }, []);

  // Use custom APIs or defaults
  const fetchFloorPlans = customApis.fetchFloorPlans || defaultFetchFloorPlans;
  const createFloorPlan = customApis.createFloorPlan || defaultCreateFloorPlan;
  const updateFloorPlan = customApis.updateFloorPlan || defaultUpdateFloorPlan;
  const deleteFloorPlan = customApis.deleteFloorPlan || defaultDeleteFloorPlan;

  // Load floor plans
  const loadFloorPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchFloorPlans(projectId);
      setFloorPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFloorPlans, projectId]);

  // Create a new floor plan
  const handleCreateFloorPlan = useCallback(async (name: string) => {
    try {
      const newPlan = await createFloorPlan(projectId, name);
      setFloorPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create floor plan');
      return null;
    }
  }, [createFloorPlan, projectId]);

  // Update an existing floor plan
  const handleUpdateFloorPlan = useCallback(async (planId: string, data: Partial<FloorPlan>) => {
    try {
      const updatedPlan = await updateFloorPlan(projectId, planId, data);
      setFloorPlans(prev => 
        prev.map(plan => plan.id === planId ? { ...plan, ...updatedPlan } : plan)
      );
      return updatedPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update floor plan');
      return null;
    }
  }, [updateFloorPlan, projectId]);

  // Delete a floor plan
  const handleDeleteFloorPlan = useCallback(async (planId: string) => {
    try {
      await deleteFloorPlan(projectId, planId);
      setFloorPlans(prev => prev.filter(plan => plan.id !== planId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete floor plan');
      return false;
    }
  }, [deleteFloorPlan, projectId]);

  // Initial load
  useEffect(() => {
    loadFloorPlans();
  }, [loadFloorPlans]);

  // Polling for updates
  useEffect(() => {
    if (!pollingInterval) return;
    
    const interval = setInterval(() => {
      loadFloorPlans();
    }, pollingInterval);
    
    return () => clearInterval(interval);
  }, [loadFloorPlans, pollingInterval]);

  return {
    floorPlans,
    isLoading,
    error,
    refreshFloorPlans: loadFloorPlans,
    createFloorPlan: handleCreateFloorPlan,
    updateFloorPlan: handleUpdateFloorPlan,
    deleteFloorPlan: handleDeleteFloorPlan
  };
};
