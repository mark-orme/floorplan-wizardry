
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FloorPlan } from '@/types/floorPlanTypes';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for interacting with floor plans in Supabase
 */
export function useSupabaseFloorPlans() {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  /**
   * Fetch all floor plans for the current user
   */
  const listFloorPlans = async (): Promise<FloorPlan[]> => {
    setIsLoading(true);
    setError('');

    try {
      // Make sure we have a user
      if (!user) {
        setError('User not authenticated');
        return [];
      }

      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        setError(error.message);
        return [];
      }

      const formattedFloorPlans: FloorPlan[] = data.map(item => ({
        id: item.id,
        name: item.name,
        data: item.data,
        userId: item.user_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        label: item.name, // For compatibility
        index: 0, // Default
        level: 0, // Default
      }));

      setFloorPlans(formattedFloorPlans);
      return formattedFloorPlans;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error fetching floor plans';
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a single floor plan by ID
   */
  const getFloorPlan = async (id: string): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        return null;
      }

      if (!data) {
        setError('Floor plan not found');
        return null;
      }

      const floorPlan: FloorPlan = {
        id: data.id,
        name: data.name,
        data: data.data,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        label: data.name, // For compatibility
        index: 0, // Default
        level: 0 // Default
      };

      setCurrentFloorPlan(floorPlan);
      return floorPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error fetching floor plan';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new floor plan
   */
  const createFloorPlan = async (floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError('');

    try {
      // Make sure we have a user
      if (!user) {
        setError('User not authenticated');
        return null;
      }

      const newFloorPlan = {
        name: floorPlan.name || 'Untitled Floor Plan',
        data: floorPlan.data || {},
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('floor_plans')
        .insert([newFloorPlan])
        .select();

      if (error) {
        setError(error.message);
        return null;
      }

      const createdFloorPlan: FloorPlan = {
        id: data[0].id,
        name: data[0].name,
        data: data[0].data,
        userId: data[0].user_id,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at,
        label: data[0].name, // For compatibility
        index: 0, // Default
        level: 0 // Default
      };

      setFloorPlans(prev => [createdFloorPlan, ...prev]);
      setCurrentFloorPlan(createdFloorPlan);
      return createdFloorPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error creating floor plan';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update a floor plan
   */
  const updateFloorPlan = async (id: string, updates: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError('');

    try {
      // Convert FloorPlan to Supabase table format
      const supabaseUpdates: any = {};
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.data) supabaseUpdates.data = updates.data;
      // Add other fields as needed

      const { data, error } = await supabase
        .from('floor_plans')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        setError(error.message);
        return null;
      }

      if (!data) {
        setError('Floor plan not found');
        return null;
      }

      const updatedFloorPlan: FloorPlan = {
        id: data.id,
        name: data.name,
        data: data.data,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        label: data.name, // For compatibility
        index: 0, // Default
        level: 0 // Default
      };

      // Update in state
      setFloorPlans(prev => prev.map(fp => fp.id === id ? updatedFloorPlan : fp));
      if (currentFloorPlan?.id === id) {
        setCurrentFloorPlan(updatedFloorPlan);
      }
      
      return updatedFloorPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error updating floor plan';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a floor plan
   */
  const deleteFloorPlan = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id);

      if (error) {
        setError(error.message);
        return false;
      }

      // Update state
      setFloorPlans(prev => prev.filter(fp => fp.id !== id));
      if (currentFloorPlan?.id === id) {
        setCurrentFloorPlan(null);
      }
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error deleting floor plan';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    floorPlans,
    currentFloorPlan,
    listFloorPlans,
    getFloorPlan,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan
  };
}
