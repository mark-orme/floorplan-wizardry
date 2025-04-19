
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FloorPlan } from '@/types/floorPlanTypes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UseSupabaseFloorPlansReturn {
  isLoading: boolean;
  error: string;
  floorPlans: FloorPlan[];
  currentFloorPlan: FloorPlan | null;
  listFloorPlans: () => Promise<FloorPlan[]>;
  getFloorPlan: (id: string) => Promise<FloorPlan | null>;
  createFloorPlan: (floorPlan: Partial<FloorPlan>) => Promise<FloorPlan | null>;
  updateFloorPlan: (id: string, floorPlan: Partial<FloorPlan>) => Promise<boolean>;
  deleteFloorPlan: (id: string) => Promise<boolean>;
}

export function useSupabaseFloorPlans(): UseSupabaseFloorPlansReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const { user } = useAuth();

  // List floor plans
  const listFloorPlans = useCallback(async (): Promise<FloorPlan[]> => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match our FloorPlan interface
      const transformedData: FloorPlan[] = data.map(item => ({
        id: item.id,
        name: item.name,
        data: item.data,
        userId: item.user_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setFloorPlans(transformedData);
      return transformedData;
    } catch (err: any) {
      const errorMessage = err.message || 'Error fetching floor plans';
      setError(errorMessage);
      console.error('Error fetching floor plans:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Get a single floor plan by ID
  const getFloorPlan = useCallback(async (id: string): Promise<FloorPlan | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        setError('Floor plan not found');
        return null;
      }
      
      // Transform to match our interface
      const floorPlan: FloorPlan = {
        id: data.id,
        name: data.name,
        data: data.data,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setCurrentFloorPlan(floorPlan);
      return floorPlan;
    } catch (err: any) {
      const errorMessage = err.message || 'Error fetching floor plan';
      setError(errorMessage);
      console.error('Error fetching floor plan:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Create a new floor plan
  const createFloorPlan = useCallback(async (floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .insert({
          name: floorPlan.name || 'Untitled Floor Plan',
          data: floorPlan.data || {},
          user_id: user.id
        });
      
      if (error) {
        throw error;
      }
      
      // Fetch the created floor plan to get all fields
      if (data && data.length > 0) {
        const newFloorPlan = await getFloorPlan(data[0].id);
        if (newFloorPlan) {
          toast.success('Floor plan created successfully');
          return newFloorPlan;
        }
      }
      
      setError('Error creating floor plan');
      return null;
    } catch (err: any) {
      const errorMessage = err.message || 'Error creating floor plan';
      setError(errorMessage);
      console.error('Error creating floor plan:', err);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, getFloorPlan]);
  
  // Update an existing floor plan
  const updateFloorPlan = useCallback(async (id: string, floorPlan: Partial<FloorPlan>): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase
        .from('floor_plans')
        .update({
          name: floorPlan.name,
          data: floorPlan.data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Refresh current floor plan if it's the one being updated
      if (currentFloorPlan && currentFloorPlan.id === id) {
        getFloorPlan(id);
      }
      
      toast.success('Floor plan updated successfully');
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error updating floor plan';
      setError(errorMessage);
      console.error('Error updating floor plan:', err);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, currentFloorPlan, getFloorPlan]);
  
  // Delete a floor plan
  const deleteFloorPlan = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setFloorPlans(prevFloorPlans => prevFloorPlans.filter(fp => fp.id !== id));
      
      // Clear current floor plan if it's the one being deleted
      if (currentFloorPlan && currentFloorPlan.id === id) {
        setCurrentFloorPlan(null);
      }
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error deleting floor plan';
      setError(errorMessage);
      console.error('Error deleting floor plan:', err);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, currentFloorPlan]);
  
  // Fetch floor plans on component mount or when user changes
  useEffect(() => {
    if (user) {
      listFloorPlans();
    } else {
      setFloorPlans([]);
      setCurrentFloorPlan(null);
    }
  }, [user, listFloorPlans]);
  
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
