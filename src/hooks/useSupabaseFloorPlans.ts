
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';

export const useSupabaseFloorPlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan>({
    id: '',
    name: '',
    data: {},
    userId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const listFloorPlans = useCallback(async (): Promise<FloorPlan[]> => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const typedFloorPlans = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        data: plan.data,
        userId: plan.user_id,
        createdAt: plan.created_at || new Date().toISOString(),
        updatedAt: plan.updated_at || new Date().toISOString(),
      }));
      
      setFloorPlans(typedFloorPlans);
      return typedFloorPlans;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load floor plans';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const getFloorPlan = useCallback(async (id: string): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load floor plan';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const createFloorPlan = useCallback(async (floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get user ID
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('floor_plans')
        .insert([
          {
            name: floorPlan.name || 'Untitled Floor Plan',
            data: floorPlan.data || {},
            user_id: userData.user.id
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newFloorPlan: FloorPlan = {
        id: data.id,
        name: data.name,
        data: data.data,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setFloorPlans(prev => [newFloorPlan, ...prev]);
      setCurrentFloorPlan(newFloorPlan);
      
      toast.success('Floor plan created');
      return newFloorPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create floor plan';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateFloorPlan = useCallback(async (id: string, floorPlan: Partial<FloorPlan>): Promise<FloorPlan | null> => {
    setIsLoading(true);
    setError('');
    
    try {
      const updates: any = {};
      if (floorPlan.name !== undefined) updates.name = floorPlan.name;
      if (floorPlan.data !== undefined) updates.data = floorPlan.data;
      
      const { data, error } = await supabase
        .from('floor_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedFloorPlan: FloorPlan = {
        id: data.id,
        name: data.name,
        data: data.data,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setFloorPlans(prev => 
        prev.map(p => p.id === id ? updatedFloorPlan : p)
      );
      
      if (currentFloorPlan.id === id) {
        setCurrentFloorPlan(updatedFloorPlan);
      }
      
      toast.success('Floor plan updated');
      return updatedFloorPlan;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update floor plan';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentFloorPlan.id]);
  
  const deleteFloorPlan = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setFloorPlans(prev => prev.filter(p => p.id !== id));
      
      if (currentFloorPlan.id === id) {
        setCurrentFloorPlan({
          id: '',
          name: '',
          data: {},
          userId: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      toast.success('Floor plan deleted');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete floor plan';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentFloorPlan.id]);
  
  // Load floor plans on init
  useEffect(() => {
    listFloorPlans();
  }, [listFloorPlans]);
  
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
};
