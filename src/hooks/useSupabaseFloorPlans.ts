import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { FloorPlan } from '@/types/floorPlanTypes';
import { safeQuery, safeFilterQuery } from '@/utils/supabase/supabaseApiWrapper';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabaseFloorPlans = () => {
  const [loading, setLoading] = useState(false);

  const getFloorPlan = async (id: string) => {
    if (!supabase) return { data: null, error: 'Supabase client not initialized' };
  
    setLoading(true);
    try {
      const { data, error } = await safeQuery(
        supabase.from('floor_plans').select().eq('id', id)
      );
      
      if (error) {
        console.error('Error fetching floor plan:', error);
        toast.error('Failed to load floor plan');
        return { data: null, error };
      }
      
      const floorPlan = data?.[0];
      return { data: floorPlan, error: null };
    } catch (error) {
      console.error('Error fetching floor plan:', error);
      toast.error('Failed to load floor plan');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const createFloorPlan = async (floorPlan: FloorPlan) => {
    if (!supabase) return { data: null, error: 'Supabase client not initialized' };
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .insert([floorPlan])
        .select();
      
      if (error) {
        console.error('Error creating floor plan:', error);
        toast.error('Failed to create floor plan');
        return { data: null, error };
      }
      
      const newFloorPlan = data?.[0];
      return { data: newFloorPlan, error: null };
    } catch (error) {
      console.error('Error creating floor plan:', error);
      toast.error('Failed to create floor plan');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateFloorPlan = async (id: string, updates: Partial<FloorPlan>) => {
    if (!supabase) return { data: null, error: 'Supabase client not initialized' };
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating floor plan:', error);
        toast.error('Failed to update floor plan');
        return { data: null, error };
      }
      
      const updatedFloorPlan = data?.[0];
      return { data: updatedFloorPlan, error: null };
    } catch (error) {
      console.error('Error updating floor plan:', error);
      toast.error('Failed to update floor plan');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteFloorPlan = async (id: string) => {
    if (!supabase) return { data: null, error: 'Supabase client not initialized' };
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error deleting floor plan:', error);
        toast.error('Failed to delete floor plan');
        return { data: null, error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      toast.error('Failed to delete floor plan');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getAllFloorPlans = async () => {
    if (!supabase) return { data: [], error: 'Supabase client not initialized' };
    
    setLoading(true);
    try {
      const { data, error } = await safeQuery(
        supabase.from('floor_plans').select()
      );
      
      if (error) {
        console.error('Error fetching floor plans:', error);
        toast.error('Failed to load floor plans');
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching floor plans:', error);
      toast.error('Failed to load floor plans');
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  };

  const getFloorPlansByUserId = async (userId: string) => {
    if (!supabase) return { data: [], error: 'Supabase client not initialized' };
    
    setLoading(true);
    try {
      const { data, error } = await safeQuery(
        supabase.from('floor_plans').select().eq('user_id', userId)
      );
      
      if (error) {
        console.error('Error fetching floor plans:', error);
        toast.error('Failed to load floor plans');
        return { data: [], error };
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching floor plans:', error);
      toast.error('Failed to load floor plans');
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getFloorPlan,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    getAllFloorPlans,
    getFloorPlansByUserId,
  };
};
